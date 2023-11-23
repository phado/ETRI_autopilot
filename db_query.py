"""
DB 쿼리 관련 함수 집합
"""
import logging
import traceback
from common_management import *

logging.basicConfig(filename='./DB_Query.log', level=logging.ERROR)


def db_login(mariadb_pool,usr_id,usr_pwd):
    """
    회원 로그인
    :param mariadb_pool:
    :param usr_id:
    :param usr_pwd:
    :return:
    """

    login_json_result = make_response_json(['login'])

    try:
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = "아이디 조회 쿼리"

        cursor.execute(query, (usr_id,usr_pwd))
        result = cursor.fetchone()

        login_json_result['login'] = result[0]

        login_json_result = success_message_json(login_json_result)

    except Exception as e:
        print(e)
        login_json_result = fail_message_json(login_json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

    return login_json_result


def db_register(mariadb_pool,usr_id,usr_nick_name,usr_pwd,usr_name,usr_phone,usr_email,usr_agency):
    """
        회원 가입

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
    reg_json_result = make_response_json([])
    try:
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "회원가입 쿼리",
            (usr_id,usr_nick_name,usr_pwd,usr_name,usr_phone,usr_email,usr_agency)
        )
        connection.commit()
        reg_json_result = success_message_json(reg_json_result)

    except Exception as e:
        print(e)
        reg_json_result = fail_message_json(reg_json_result)
        if connection: connection.rollback()

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

    return reg_json_result

def db_find_id(mariadb_pool, usr_name, usr_phone):
    """
    아이디 찾기
    :param mariadb_pool:
    :param usr_name:
    :param usr_phone:
    :return: 아디디, 가입일 전달  or 아이디 없으면 빈 str 전달
    """
    json_result = make_response_json([])
    try:
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        cursor.execute("아이디 카운트 쿼리", (usr_name, usr_phone))
        count = cursor.fetchone()[0]
        if count == 1:
            cursor.execute("아이디 찾는 쿼리", (usr_name, usr_phone))
            json_result['usr_id'] = cursor.fetchall()[0]
            json_result['reg_date'] = cursor.fetchall()[1]

        else:
            json_result['usr_id'] = ''
        json_result = success_message_json(json_result)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection:connection.close()

    return json_result

def db_count_id(mariadb_pool, usr_id):
    """
    아이디 존재 여부 확인
    :param mariadb_pool:
    :param usr_id:
    :return: 존재하면 1 ,없으면 0
    """
    json_result = make_response_json([])
    try:
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        cursor.execute("아이디 카운트 쿼리", usr_id)

        json_result['count'] = cursor.fetchone()[0]
        json_result = success_message_json(json_result)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

    return json_result

def db_reset_pwd(mariadb_pool, new_pwd, usr_id):
    """
    비빌번호 변경
    :param usr_id:
    :param mariadb_pool:
    :param new_pwd:
    :return: json
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()

        cursor = connection.cursor()
        cursor.execute('비밀 번호 수정 ', (new_pwd,usr_id))
        connection.commit()

        json_result = success_message_json(json_result)

    except Exception as e:
        print(e)
        if connection: connection.rollback()
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

    return json_result

def db_mdm_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id):
    """
    데이터 관리 게시판 목록
    @param mariadb_pool:
    @param page_num:
    @param search_type:
    @param search_key_word:
    @param show_data_mount:
    @param usr_id:
    @return: 데이터 목록 리스트를 담은 딕션어리
    """
    try:

        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = "데이터관리 목록 조회 쿼리"

        cursor.execute(query, (page_num,search_type,search_key_word,show_data_mount,usr_id))
        board_result = cursor.fetchall()

        json_result['board_result'] = board_result

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)
    finally:
        if cursor: cursor.close()
        if connection: connection.close()
    
    
    return json_result

def db_count_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type):
    """
    데이터 목록 관리 게시판의 목록의 숫자를 카운트한다.
    @param tabel_type: 테이블 명으로 조회할 테이블을 명
    @param mariadb_pool:
    @param page_num:
    @param search_type:
    @param search_key_word:
    @param show_data_mount:
    @param usr_id:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = "데이터 목록 숫자 카운트 쿼리"

        cursor.execute(query, (page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type))
        board_cnt = cursor.fetchone()

        json_result['board_cnt'] = board_cnt[0]
        json_result = success_message_json(json_result)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)
    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result

if __name__ == "__main__":
    pass