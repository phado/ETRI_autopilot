from flask import Flask, request, render_template,session, redirect, url_for
from db_conn import get_pool_conn
from db_query import db_register, db_count_id, db_count_board_list, db_get_board_list, db_data_set_detail, \
    db_model_detail, db_get_labeler, db_get_devloper, db_get_dataset, db_get_inspector, \
    db_change_confirm_done, db_change_labeling_done, db_systemManager_detail, db_changePermission, db_get_user_info
from user_management import def_login, def_find_id, def_find_pwd, def_reset_pwd,user_secession
from common_management import fail_message_json, make_response_json, success_message_json

import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

mariadb_pool = get_pool_conn()


# ------------------------------------------------------------------------------------------------------
# -----------------------------------------로그인 관련 페이지-----------------------------------------------
@app.route('/', methods=['GET', 'POST'])
def login():

    """
        로그인
        login_result['login'] = 실패 0 성공 1
        login_result['login_info'] 성공시 회원 tu.usr_idx ,tu.usr_nick ,tu.grp_idx 정보
        """
    if request.method == 'POST':
        try:
            usr_id = request.form["username"]
            usr_pwd = request.form["password"]

            login_result = def_login(mariadb_pool,usr_id, usr_pwd)
            if login_result['login'] == 1:
                session['usr_idx'] = login_result['login_info'][0]
                session['usr_id'] = usr_id
                session['usr_nick'] = login_result['login_info'][2]
                session['grp_idx'] = login_result['login_info'][3]
                session['grp_nm_en'] = login_result['login_info'][4]
                session['usr_nm'] = login_result['login_info'][5]

                return redirect(url_for('dataManagement'))

            else:
                return render_template('login/login.html',login_msg='로그인 실패. 일치하는 회원이 없습니다.' )
        except Exception as e:
            print(e)
            login_result = fail_message_json(login_result)


        finally:
            pass

        return login_result
    else:
        return render_template('login/login.html')

@app.route('/logout', methods=['POST'])
def logout():
    # 세션에서 사용자 정보 삭제
    session.clear()
    return {'message': 'Logged out successfully'}


@app.route('/register', methods=['POST'])
def register():
    """
        회원가입 로직
    """

    if request.method == 'POST':
        try:
            data = request.get_json()

            usr_id = data['userId']
            usr_nick_name = data['usrNickName']
            usr_pwd = data['usrPwd']
            usr_name = data['usrName']
            usr_phone = data['usrPhone']
            usr_email = data['usrEmail']
            usr_agency = data['usrAgency']

            json_result = db_register(mariadb_pool,usr_id,usr_nick_name,usr_pwd,usr_name,usr_phone,usr_email,usr_agency)
        except Exception as e:
            print(e)
            json_result = fail_message_json(json_result)

    return json_result

@app.route('/userManagement/systemManager/changePermission', methods=['POST'])
def changePermission():
    """
        관리자 권한 변경 
    """

    if request.method == 'POST':
        try:
            data = request.get_json()

            permissons = data['permissions']

            user_idx = data['user_idx']

            json_result = db_changePermission(mariadb_pool,permissons,user_idx)
        except Exception as e:
            print(e)
            json_result = fail_message_json(json_result)

    return json_result


@app.route('/findId', methods=['POST'])
def findId():
    """
        아이디찾기
        json_result['find_id'] = len(result) / 존재 1 없음 0
        json_result['id_info'] = result 존재 할때 회원 정보 저장
    """
    try:
        data = request.get_json()

        usr_name = data['usrName']
        usr_phone = data['usrPhone']

        json_result = def_find_id(mariadb_pool, usr_name, usr_phone)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result

@app.route('/countId')
def countId():
    """
       아이디 존재 확인, 아이디 카운트
    """
    try:
        usr_id = request.form.get('usrId')
        json_result = db_count_id(mariadb_pool, usr_id)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result



@app.route('/findPwd')
def findPwd():
    """
       비밀번호 찾기
    """
    try:
        pwd_new = request.form.get('newPwd')
        usr_id = session['usr_id']

        json_result = make_response_json([])
        # json_result = def_find_pwd(mariadb_pool, usr_name, usr_phone) #todo 비밀 번호 찾기
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result

    return render_template("")


@app.route('/resetPwd', methods=['POST'])
def resetPwd():
    """
       비밀번호 수정
    """
    try:
        data = request.get_json()

        new_pwd = data['new_pwd'] 
        usr_idx = data['usr_idx']
 

        json_result = def_reset_pwd(mariadb_pool, new_pwd, usr_idx)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result

@app.route('/userSecession', methods=['POST'])
def userSecession():
    """
    회원 탈퇴 
    """
    try:
        data = request.get_json()

        usr_idx = data['usr_idx'] 
 

        json_result = user_secession(mariadb_pool,usr_idx)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result

# ------------------------------------------------------------------------------------------------
# -----------------------------------------메인 페이지-----------------------------------------------
# 1. 데이터 관리 탭
@app.route('/dataManagement')
def dataManagement():
    """
    데이터 목록
    :return: 게시판 목록, 전체 페이지 수량, 선택된 페이지
    """
    try:
        # session['usr_id'] = 'gywjd1108'

        tbl_type = 'tb_prj_datasets'

        page_num = request.form.get('pageNum')
        if page_num is None: page_num = 1

        search_type = request.form.get('searchType')
        if search_type is None: search_type = None

        search_key_word = request.form.get('keyWord')
        if search_key_word is None: search_key_word = None

        show_data_mount = request.form.get('showDataMount')
        if show_data_mount is None: show_data_mount = 10

        result_json = make_response_json([])


        board_list = db_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,session['usr_id'],tbl_type,session['usr_nick'],session['grp_nm_en'])
        board_cnt = db_count_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,session['usr_id'],tbl_type,session['usr_nick'],session['grp_nm_en'])

        usr_idx= session['usr_idx']
        usr_id= session['usr_id']
        grp_idx=session['grp_idx']
        usr_nick= session['usr_nick']
        grp_nm_en= session['grp_nm_en']
        usr_nm= session['usr_nm']
        # usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm

        if board_cnt['status'] =='200'  and board_list['status'] =='200':
            result_json = success_message_json(result_json)
        else:
            result_json = fail_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return render_template("main/dataManagement.html", board_list=board_list['board_result'], page_cnt=board_cnt ,page_num=page_num, result_json = result_json , usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)

# 2. 모델 관리 탭
@app.route('/modelManagement')
def modelManagement():
    """
    모델 목록
    :return:
    """
    # session['usr_id'] = 'gywjd1108'
    try:
        tbl_type = 'tb_prj_models'

        page_num = request.form.get('pageNum')
        if page_num is None: page_num = 1

        search_type = request.form.get('searchType')
        if search_type is None: search_type = None

        search_key_word = request.form.get('keyWord')
        if search_key_word is None: search_key_word = None

        show_data_mount = request.form.get('showDataMount')
        if show_data_mount is None: show_data_mount = 10

        result_json = make_response_json([])

        board_list = db_get_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                    session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])
        board_cnt = db_count_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                     session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])

        usr_idx= session['usr_idx']
        usr_id= session['usr_id']
        grp_idx=session['grp_idx']
        usr_nick= session['usr_nick']
        grp_nm_en= session['grp_nm_en']
        usr_nm= session['usr_nm']
        #  usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm

        if board_cnt['status'] == '200' and board_list['status'] == '200':
            result_json = success_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return render_template("main/modelManagement.html", board_list=board_list['board_result'], page_cnt=board_cnt ,page_num=page_num, result_json = result_json, usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)

# drawIO
@app.route('/modeling')
def modeling():
    try:
        usr_idx= session['usr_idx']
        usr_id= session['usr_id']
        grp_idx=session['grp_idx']
        usr_nick= session['usr_nick']
        grp_nm_en= session['grp_nm_en']
        usr_nm= session['usr_nm']

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return render_template('index.html', usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)

@app.route('/open', methods=['GET', 'POST'])
def projectOpen():
    return render_template('open.html')


# 3. 사용자 관리 탭
@app.route('/userManagement_systemManager')
def userManagementSystemManager():
    """
    사용자관리 / 시스템 관리자
    :return:
    """
    session['usr_id'] = 'gywjd1108'
    try:
        tbl_type = 'tb_users_1'

        page_num = request.form.get('pageNum')
        if page_num is None: page_num = 1

        search_type = request.form.get('searchType')
        if search_type is None: search_type = None

        search_key_word = request.form.get('keyWord')
        if search_key_word is None: search_key_word = None

        show_data_mount = request.form.get('showDataMount')
        if show_data_mount is None: show_data_mount = 10

        result_json = make_response_json([])

        board_list = db_get_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount, session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])
        board_cnt = db_count_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount, session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])

        usr_idx= session['usr_idx']
        usr_id= session['usr_id']
        grp_idx=session['grp_idx']
        usr_nick= session['usr_nick']
        grp_nm_en= session['grp_nm_en']
        usr_nm= session['usr_nm']
        #  usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm

        if board_cnt['status'] == '200' and board_list['status'] == '200':
            result_json = success_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)
    return render_template("main/userManagement/systemManager.html", board_list=board_list['board_result'], page_cnt=board_cnt ,page_num=page_num, result_json = result_json,usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)

@app.route('/userManagement_dataManager')
def userManagementDataManager():
    """
    사용자관리 / 데이터 관리자
    :return:
    """
    session['usr_id'] = 'gywjd1108'
    try:
        tbl_type = 'tb_users_2'

        page_num = request.form.get('pageNum')
        if page_num is None: page_num = 1

        search_type = request.form.get('searchType')
        if search_type is None: search_type = None

        search_key_word = request.form.get('keyWord')
        if search_key_word is None: search_key_word = None

        show_data_mount = request.form.get('showDataMount')
        if show_data_mount is None: show_data_mount = 10

        result_json = make_response_json([])

        board_list = db_get_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                       session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])
        board_cnt = db_count_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                        session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])
        
        usr_idx= session['usr_idx']
        usr_id= session['usr_id']
        grp_idx=session['grp_idx']
        usr_nick= session['usr_nick']
        grp_nm_en= session['grp_nm_en']
        usr_nm= session['usr_nm']
        #  usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm

        if board_cnt['status'] == '200' and board_list['status'] == '200':
            result_json = success_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)
    return render_template("main/userManagement/dataManager.html", board_list=board_list['board_result'], page_cnt=board_cnt ,page_num=page_num, result_json = result_json,usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)



@app.route('/userManagement_modelManager')
def userManagementModelManager():
    """
    사용자관리 / 모델 관리자
    :return:
    """
    session['usr_id'] = 'gywjd1108'
    try:
        tbl_type = 'tb_users_3'

        page_num = request.form.get('pageNum')
        if page_num is None: page_num = 1

        search_type = request.form.get('searchType')
        if search_type is None: search_type = None

        search_key_word = request.form.get('keyWord')
        if search_key_word is None: search_key_word = None

        show_data_mount = request.form.get('showDataMount')
        if show_data_mount is None: show_data_mount = 10

        result_json = make_response_json([])

        board_list = db_get_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                       session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])
        board_cnt = db_count_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                        session['usr_id'], tbl_type,session['usr_nick'],session['grp_nm_en'])
        
        usr_idx= session['usr_idx']
        usr_id= session['usr_id']
        grp_idx=session['grp_idx']
        usr_nick= session['usr_nick']
        grp_nm_en= session['grp_nm_en']
        usr_nm= session['usr_nm']
        #  usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm

        if board_cnt['status'] == '200' and board_list['status'] == '200':
            result_json = success_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)
    return render_template("main/userManagement/modelManager.html", board_list=board_list['board_result'], page_cnt=board_cnt ,page_num=page_num, result_json = result_json,usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)

# 4. 시스템 관리 탭
@app.route('/systemManagement_agencyManagement')
def systemManagementAgencyManager():
    """
    시스템 관리 / 기관 관리
    :return:
    """
    usr_idx= session['usr_idx']
    usr_id= session['usr_id']
    grp_idx=session['grp_idx']
    usr_nick= session['usr_nick']
    grp_nm_en= session['grp_nm_en']
    usr_nm= session['usr_nm']
    #  usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm
    return render_template("main/systemManagement/agencyManagement.html", usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)

# ------------------------------------------------------------------------------------------------------
# -----------------------------------------페이지-----------------------------------------------
@app.route('/common')
def common():
    # 세션에서 사용자 정보 가져가 title에 회원 정보 띄우기 
    usr_idx= session['usr_idx']
    usr_id= session['usr_id']
    grp_idx=session['grp_idx']
    usr_nick= session['usr_nick']
    grp_nm_en= session['grp_nm_en']
    usr_nm= session['usr_nm']

    render_template("common/common.html"  , usr_idx=usr_idx, usr_id=usr_id, usr_nick=usr_nick, grp_idx=grp_idx, grp_nm_en=grp_nm_en, usr_nm=usr_nm)
# ------------------------------------------------------------------------------------------------
# -----------------------------------------세부 페이지 데이터셋 추가-----------------------------------
@app.route('/dataManagement/dataSetDetail', methods=['POST'])
def dataSetDetail():
    """
    데이터셋 관리 - 데이터셋 상세 정보

    figma : 데이터 관리_데이터 목록_상세정보

    """
    try:
        # session['usr_id'] = 'gywjd1108'

        result_json = make_response_json([])

        data = request.get_json()

        dataset_idx = data['datasetIdx']

        # dataset_idx = '43'
        detail_list = db_data_set_detail(mariadb_pool, dataset_idx)

        result_json = success_message_json(result_json)

        result_json['data_set_info'] = detail_list['data_set_info']
        result_json['data_set_labeler_info'] = detail_list['data_set_labeler_info']


    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json


@app.route('/userManagement/systemManager/detailInfo', methods=['POST'])
def systemManagerDetail():
    """
    사용자 관리 - 시스템 관리자 상세 정보

    """
    try:
        usr_id= session['usr_id']

        result_json = make_response_json([])

        data = request.get_json()

        managerIdx = data['managerIdx']

        detail_list = db_systemManager_detail(mariadb_pool, managerIdx)

        result_json = success_message_json(result_json)

        result_json['systemManagerInfo'] = detail_list['systemManagerInfo']


    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json


@app.route('/dataManagement/getLabeler', methods=['POST'])
def getLabeler():
    """
    그룹 아이디로 라벨러 조회
    데이터셋 추가 - 그룹(기관)별 라벨러 조회
    figma : 데이터셋 추가_라벨러 추가_팝업에서 라벨러 조회

    """
    try:

        result_json = make_response_json([])

        data = request.get_json()

        grp_idx = data['grp_idx']

        labeler_list = db_get_labeler(mariadb_pool,grp_idx)

        result_json['labeler_list'] = labeler_list['labeler_list']
        # result_json['labeler_list'] =  [('하루미'),('라벨러'),('라벨링'),('하루다'),('KPST_1'),('user_3'),('음성라벨러'),('이미라벨'),('라벨러3'),('라벨링')]


    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json


@app.route('/dataManagement/getInspector', methods=['POST'])
def getInspector():
    """
    그룹 아이디로 검수자 조회
    데이터셋 추가 - 그룹(기관)별 검수자 조회
    figma : 데이터셋 추가_라벨러 추가_팝업에서 검수자 조회

    """
    try:

        result_json = make_response_json([])
        grp_idx = 0 # todo 하드 코딩
        # grp_idx = session['grp_idx']

        labeler_list = db_get_inspector(mariadb_pool,grp_idx)

        result_json['inspector_list'] = labeler_list

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json
        # result_json['labeler_list'] =  [('검수자1'),('검수자2'),('검수자3')]


@app.route('/modelManagement/getDevloper', methods=['POST'])
def getDevloper():
    """
    모델 추가 - 그룹(기관)별 개발자 조회
    figma : 모델 추가_개발자 조회

    """
    try:

        result_json = make_response_json([])
        # grp_idx = '1' # todo 하드 코딩
        grp_idx = session['grp_idx']

        labeler_list = db_get_devloper(mariadb_pool,grp_idx)

        result_json['devloper_list'] = labeler_list
        # result_json['devloper_list'] = [('개발1'),('개발자_2'),('개발자_3'),('개발자_4')]

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json

@app.route('/modelManagement/getDataSet', methods=['POST'])
def getDataSet():
    """
    모델 추가  - 모델 추가_데이터셋 팝업
    figma : 모델 추가_데이터셋 검색

    """
    try:

        result_json = make_response_json([])

        result_json = make_response_json([])
        # grp_idx = '1'
        grp_idx = session['grp_idx']

        labeler_list = db_get_dataset(mariadb_pool,grp_idx ,session['usr_nick'],session['grp_nm_en'])

        result_json['dataset_list'] = labeler_list

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json

@app.route('/modelManagement/ModelDetail', methods=['POST'])
def ModelDetail():
    """
    모델 관리_모델 상세 페이지

    figma : 데이터관리_모델 목록_상세정보

    """
    try:
        session['usr_id'] = 'gywjd1108'


        result_json = make_response_json([])

        data = request.get_json()
        model_idx = data['modelIdx']
        detail_list = db_model_detail(mariadb_pool, model_idx)

        result_json = success_message_json(result_json)
        result_json['model_detail_info'] = detail_list['model_detail_info']

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json


@app.route('/modelManagement/changeConfirmDone', methods=['POST'])
def changeConfirmDone():
    """
    데이터 셋에 속한 라벨러의 검수 완료
    result_json['labeler']['fixed_labeler'] ->값에 업데이트 된 라벨러 정보 전달
    result_json['labeler']['dataset_confrim_fixed'] = '1' ->모든 라벨러 완료시 데이터셋 프로젝트 진행 상태 완료로 변경
    result_json['labeler']['dataset_confrim_fixed'] = '1' ->일때 게시판 새로 고침필요

    figma : 데이터관리_모델 목록_상세정보

    """
    try:
        result_json = make_response_json([])

        data = request.get_json()
        usr_nick = data['usr_nick']
        ds_name = data['ds_name']

        # 라벨러 권한 업데이트
        result_json['labeler'] = db_change_confirm_done(mariadb_pool,usr_nick,ds_name)

        result_json = success_message_json(result_json)

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json



@app.route('/modelManagement/changeLabelingDone', methods=['POST'])
def changeLabelingDone():
    """
    데이터 셋에 속한 라벨러의 검수 완료
    result_json['labeler']['fixed_labeler'] ->값에 업데이트 된 라벨러 정보 전달
    result_json['labeler']['dataset_labeled_fixed'] = '1' ->모든 라벨러 완료시 데이터셋 프로젝트 진행 상태 완료로 변경
    result_json['labeler']['dataset_labeled_fixed'] = '1' ->일때 게시판 새로 고침필요

    figma : 데이터관리_모델 목록_상세정보

    """
    try:
        result_json = make_response_json([])

        data = request.get_json()
        usr_nick = data['usr_nick']
        ds_name = data['ds_name']

        # 라벨러 권한 업데이트
        result_json['labeler'] = db_change_labeling_done(mariadb_pool,usr_nick,ds_name)

        result_json = success_message_json(result_json)

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json

@app.route('/common/profileData', methods=['POST'])
def profileDataLoad():
    """
    현재 로그인 된 회원의 정보를 가져오는 기능 

    """
    try:
        result_json = make_response_json([])
        data = request.get_json()
        usr_idx = data['usr_idx']

        userInfo = db_get_user_info(mariadb_pool,usr_idx)

        result_json['userInfo'] = userInfo

    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return result_json


@app.route('/grafana')
def load_grafana():
    return render_template('main/systemManagement/grafana.html')

if __name__ == '__main__':
    app.run(debug=True)


