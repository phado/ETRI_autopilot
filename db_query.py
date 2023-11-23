"""
DB 쿼리 관련 함수 집합
"""
import logging
import traceback
from common_management import make_response_json, success_message_json, fail_message_json

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

        query = f"SELECT tu.usr_idx ,tu.usr_nick ,tu.grp_idx FROM tb_users tu WHERE tu.usr_id ='{usr_id}' and tu.usr_pw ='{usr_pwd}';"

        cursor.execute(query)
        result = cursor.fetchall()

        login_json_result['login'] = len(result)
        if len(result) == 1:
            login_json_result['login_info'] = result[0]

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
    try: # todo 가입 해야함
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select grp_idx from tb_groups where grp_nm_en = '{usr_agency}';"
        cursor.execute(query)
        usr_agency_num = str(cursor.fetchone()[0])

        query = f"INSERT INTO tb_users (usr_id, usr_pw, usr_nick, usr_nm, usr_tel, usr_mail, grp_idx, is_valid) " \
                f"VALUES('{usr_id}', '{usr_pwd}', '{usr_nick_name}', '{usr_name}', '{usr_phone}', '{usr_email}', '{usr_agency_num}','1');"
        cursor.execute(query)

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
        json_result['find_id'] = len(result) / 존재 1 없음 0
        json_result['id_info'] = result 존재 할때 회원 정보 저장
    :param mariadb_pool:
    :param usr_name:
    :param usr_phone:
    :return: 아디디, 가입일 전달  or 아이디 없으면 빈 str 전달
    """
    json_result = make_response_json([])
    try:
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select usr_idx ,usr_id ,usr_cr_date from tb_users tu where tu.usr_nm='{usr_name}' and tu.usr_tel='{usr_phone}';"
        cursor.execute(query)
        result = cursor.fetchall()

        if len(result) == 1:
            json_result['find_id'] = len(result)
            json_result['id_info'] = result
        else:
            json_result['find_id'] = len(result)
            json_result['id_info'] = ''

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
        query = f" select usr_idx ,usr_id ,usr_cr_date from tb_users tu where tu.usr_id='{usr_id}';"
        cursor.execute(query)

        result = cursor.fetchall()

        if len(result) == 1:
            json_result['find_id'] = len(result)

        else:
            json_result['find_id'] = len(result)


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
        query = f"update tb_users tu set tu.usr_pw='{new_pwd}' where tu.usr_idx ='{usr_id}';"
        cursor.execute(query)
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

def db_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type):
    """
    데이터 관리 게시판 목록
    @param tabel_type: 조회할 테이블의 이름!!
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

        query = ''
        if tabel_type == 'tb_prj_datasets': # 데이터터 관리 목록 조회
            query = "SELECT tpd.ds_idx ,tpd.ds_name , tg.grp_nm_en ,tg.grp_nm_kr , tds.lb_stat_idx, tds.inp_stat_idx , tpd.ds_create_date ,tpd.ds_modify_date, tpd.ds_cnt_frame ,tpd.ds_all_frame from tb_prj_datasets tpd left join tb_groups tg ON tpd.grp_idx =tg.grp_idx left join tb_datasets_state tds on tds.ds_idx =tpd.ds_idx WHERE tpd.is_valid =1;"

        elif tabel_type == 'tb_prj_models': # '모델 관리 목록 조회'
            query = "SELECT tpd.ds_idx ,tpd.ds_name , tg.grp_nm_en ,tg.grp_nm_kr , tds.lb_stat_idx, tds.inp_stat_idx , tpd.ds_create_date ,tpd.ds_modify_date, tpd.ds_cnt_frame ,tpd.ds_all_frame from tb_prj_datasets tpd left join tb_groups tg ON tpd.grp_idx =tg.grp_idx left join tb_datasets_state tds on tds.ds_idx =tpd.ds_idx WHERE tpd.is_valid =1;"

        elif tabel_type == '': # 사용자 관리 / 시스템 관리자 목록
            query = ""

        elif tabel_type == '':  # 사용자 관리 / 데이터 관리자 목록
            query = ""

        elif tabel_type == '':  # 사용자 관리 / 모델 관리
            query = ""

        cursor.execute(query)
        board_result = cursor.fetchall()


        json_result['board_result'] = board_result
        json_result['response'] = success_message_json(json_result)

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

        query = ''
        if tabel_type == 'tb_prj_datasets':  # 데이터터 관리 목록 조회
            query = ""

        elif tabel_type == 'tb_prj_models':  # '모델 관리 목록 조회'
            query = ""

        elif tabel_type == '':  # 사용자 관리 / 시스템 관리자 목록
            query = ""

        elif tabel_type == '':  # 사용자 관리 / 데이터 관리자 목록
            query = ""

        elif tabel_type == '':  # 사용자 관리 / 모델 관리
            query = ""

        cursor.execute(query)
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



def db_get_usr_info(mariadb_pool,usr_id):
    """
    로그인된 회원의 정보를 조회 하는 쿼리
    @param mariadb_pool:
    @param usr_id:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = "한 회원 목록을 전부 조회하는 쿼리"

        cursor.execute(query)
        usr_info = cursor.fetchall()

        json_result['usr_info'] = usr_info

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result


if __name__ == "__main__":
    import db_conn

    mariadb_pool = db_conn.get_pool_conn()
