from db_query import *
from common_management import *


def def_login(mariadb_pool, usr_id,usr_pwd):
    """
    회원 아이디와 회원 비밀번호를 받아서 로그인 조회
    0 = 로그인 실패
    1 = 로그인 성공

    :param mariadb_pool:
    :param usr_id:
    :param usr_pwd:
    :return: json
    """
    try:
        login_json_result = db_login(mariadb_pool,usr_id,usr_pwd)

    except Exception as e:
        print(e)
        login_json_result = fail_message_json(login_json_result)

    finally:
        return login_json_result


def def_register(mariadb_pool,usr_id,usr_nick_name,usr_pwd,usr_name,usr_phone,usr_email,usr_agency):
    """
    회원 가입 하는 함수 제이슨 반환함
    :param mariadb_pool:
    :param usr_id:
    :param usr_nick_name:
    :param usr_pwd:
    :param usr_name:
    :param usr_phone:
    :param usr_email:
    :param usr_agency:
    :return: json
    """
    try:
        register_json_result = db_register(mariadb_pool,usr_id,usr_nick_name,usr_pwd,usr_name,usr_phone,usr_email,usr_agency)

    except Exception as e:
        print(e)
        register_json_result = fail_message_json(register_json_result)

    finally:
        return register_json_result


def def_find_id(mariadb_pool, usr_name, usr_phone):
    """
    아이디 찾기
    :param mariadb_pool:
    :param usr_name:
    :param usr_phone:
    :return:
    """
    try:
        json_result = db_find_id(mariadb_pool, usr_name, usr_phone)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)
    finally:
        return json_result


def def_find_pwd():
    pass #todo 비밀번호 어떻게 하기로함?

def def_reset_pwd(mariadb_pool, new_pwd, usr_id):
    """
    비밀번호 수정하기
    :param mariadb_pool:
    :param new_pwd:
    :param usr_id:
    :return: json
    """
    try:
        json_result = db_reset_pwd(mariadb_pool, new_pwd, usr_id)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)
    finally:
        return json_result

