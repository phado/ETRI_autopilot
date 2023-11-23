from flask import Flask, request, render_template,session
from db_conn import get_pool_conn
from user_management import *
from common_management import *
from menu_data_management import *
from menu_user_management import *
from menu_model_management import *
from menu_system_management import *

app = Flask(__name__)

mariadb_pool = get_pool_conn()

@app.route('/login')
def login():
    return render_template('login/login.html')
    """
    로그인
    """
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



@app.route('/dataManagement')
def dataManagement():
    return render_template("dataManagement/dataManagement.html")
    """

    :return: 게시판 목록, 전체 페이지 수량, 선택된 페이지
    """
    try:
        page_num = request.form.get('pageNum') #todo page num이 없다면?
        if page_num is None: page_num = 1

        search_type = request.form.get('searchType')
        if search_type is None: search_type = None

        search_key_word = request.form.get('keyWord')
        if search_key_word is None: search_key_word = None

        show_data_mount = request.form.get('showDataMount')
        if show_data_mount is None: show_data_mount = 10

        board_list = mdm_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,session['usr_id'])
        board_cnt = count_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,session['usr_id'],'tb_prj_datasets')

    except Exception as e:
        print(e)

    return render_template("dataManagement/dataManagement.html", board_list=board_list, page_cnt=board_cnt ,page_num=page_num)

@app.route('/modelManagement')
def modelManagement():
    return render_template("modelManagement/modelManagement.html")
    """
    모델 목록
    :return:
    """
    return render_template("modelManagement.html")

@app.route('/userManagement')
def userManagement():
    """
    회원관리
    :return:
    """
    return render_template("userManagement.html")

@app.route('/systemManagement')
def systemManagement():
    """
    시스템 관리
    :return:
    """
    return render_template("systemManagement.html")


@app.route('/userManagement/systemManager')
def userManagementSystemManager():
    """
    사용자관리 / 시스템 관리자
    :return:
    """
    return render_template("/userManagement/systemManager.html")

@app.route('/userManagement/dataManager')
def userManagementDataManager():
    """
    사용자관리 / 데이터 관리자
    :return:
    """
    return render_template("/userManagement/dataManager.html")



@app.route('/userManagement/modelManager')
def userManagementModelManager():
    """
    사용자관리 / 모델 관리자
    :return:
    """
    return render_template("/userManagement/modelManager.html")
#
#
@app.route('/systemManagement/agencyManager')
def systemManagementAgencyManager():
    """
    시스템 관리 / 기관 관리
    :return:
    """
    return render_template("/systemManagement/agencyManager.html")

@app.route('/systemManagement/dataManager')
def systemManagementDataManager():
    """
    스시템 관리 / 데이터 관리
    :return:
    """
    return render_template("/systemManagement/dataManager.html")


if __name__ == '__main__':
    app.run(debug=True)