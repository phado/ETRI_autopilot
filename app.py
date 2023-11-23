from flask import Flask, request, render_template,session
from db_conn import get_pool_conn
from user_management import *
from common_management import *
from menu_data_management import *
from menu_user_management import *
from menu_model_management import *
from menu_system_management import *
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
mariadb_pool = get_pool_conn()
# ------------------------------------------------------------------------------------------------------
# -----------------------------------------로그인 관련 페이지-----------------------------------------------
@app.route('/login')
def login():

    """
        로그인
        login_result['login'] = 실패 0 성공 1
        login_result['login_info'] 성공시 회원 tu.usr_idx ,tu.usr_nick ,tu.grp_idx 정보
        """
    if request.method == 'POST':
        try:
            usr_id = request.form["usrId"]
            usr_pwd = request.form["usrPwd"]

            login_result = def_login(usr_id, usr_pwd)
            if login_result['login'] == '1':
                session['usr_name'] = 'usr_name'
                session['usr_id'] = usr_id

        except Exception as e:
            print(e)
            login_result = fail_message_json(login_result)


        finally:
            pass

        return login_result
    else:
        return render_template('login/login.html')
@app.route('/register')
def register():
    """
        회원가입
    """

    if request.method == 'POST':
        try:
            usr_id = request.form.get('userId')
            usr_nick_name = request.form.get('usrNickName')
            usr_pwd = request.form.get('usrPwd')
            usr_name = request.form.get('usrName')
            usr_phone = request.form.get('usrPhone')
            usr_email = request.form.get('usrEmail')
            usr_agency = request.form.get('usrAgency')

            json_result = db_register(mariadb_pool,usr_id,usr_nick_name,usr_pwd,usr_name,usr_phone,usr_email,usr_agency)
        except Exception as e:
            print(e)
            json_result = fail_message_json(json_result)

    return json_result

@app.route('/findId')
def findId():
    """
        아이디찾기
        json_result['find_id'] = len(result) / 존재 1 없음 0
        json_result['id_info'] = result 존재 할때 회원 정보 저장
    """
    try:
        usr_name = request.form.get('usrName')
        usr_phone = request.form.get('usrPhone')

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


@app.route('/resetPwd')
def resetPwd():
    """
       비밀번호 수정
    """
    try:
        new_pwd = request.form.get('newPwd')
        usr_id = session['usr_id']

        json_result = def_find_pwd(mariadb_pool, new_pwd, usr_id)

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

        board_list = get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,session['usr_id'],tbl_type)
        board_cnt = count_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,session['usr_id'],tbl_type)
        if board_cnt['status'] =='200'  and board_list['status'] =='200':
            result_json = success_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return render_template("main/dataManagement.html", board_list=board_list, page_cnt=board_cnt ,page_num=page_num, result_json = result_json)

# 2. 모델 관리 탭
@app.route('/modelManagement')
def modelManagement():
    return render_template("main/modelManagement.html")
    """
    모델 목록
    :return:
    """
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

        board_list = get_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                    session['usr_id'], tbl_type)
        board_cnt = count_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount,
                                     session['usr_id'], tbl_type)
        if board_cnt['status'] == '200' and board_list['status'] == '200':
            result_json = success_message_json(result_json)
    except Exception as e:
        print(e)
        result_json = fail_message_json(result_json)

    return render_template("main/modelManagement.html.html", board_list=board_list, page_cnt=board_cnt ,page_num=page_num, result_json = result_json)

# 3. 사용자 관리 탭
@app.route('/userManagement_systemManager')
def userManagementSystemManager():
    """
    사용자관리 / 시스템 관리자
    :return:
    """
    return render_template("main/userManagement/systemManager.html")

@app.route('/userManagement_dataManager')
def userManagementDataManager():
    """
    사용자관리 / 데이터 관리자
    :return:
    """
    return render_template("main/userManagement/dataManager.html")



@app.route('/userManagement_modelManager')
def userManagementModelManager():
    """
    사용자관리 / 모델 관리자
    :return:
    """
    return render_template("main/userManagement/modelManager.html")

# 4. 시스템 관리 탭
@app.route('/systemManagement_agencyManagement')
def systemManagementAgencyManager():
    """
    시스템 관리 / 기관 관리
    :return:
    """
    return render_template("main/systemManagement/agencyManagement.html")

# ------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)