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

        query = f"SELECT tu.usr_idx, tu.usr_id, tu.usr_nick,tg.grp_idx , tg.grp_nm_en,tu.usr_nm , tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd WHERE tu.usr_id ='{usr_id}' and tu.usr_pw ='{usr_pwd}' and tu.is_valid =1;"

        cursor.execute(query)
        result = cursor.fetchall()


        if result[0][0] is not None:
            login_json_result['login_info'] = result[0]
            login_json_result['login'] = len(result)
        else:
            login_json_result['login'] = 0

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
        if tabel_type == 'tb_prj_datasets': # 데이터 관리 목록 조회
            query = "SELECT tpd.ds_idx ,tpd.ds_name , tg.grp_nm_en ,tg.grp_nm_kr , tds.lb_stat_idx, tds.inp_stat_idx , tpd.ds_create_date ,tpd.ds_modify_date, tpd.ds_cnt_frame ,tpd.ds_all_frame from tb_prj_datasets tpd left join tb_groups tg ON tpd.grp_idx =tg.grp_idx left join tb_datasets_state tds on tds.ds_idx =tpd.ds_idx WHERE tpd.is_valid =1;"

        elif tabel_type == 'tb_prj_models': # '모델 관리 목록 조회'
            query = "SELECT tpm.prj_idx , tpm.prj_name , tg.grp_nm_en ,tg.grp_nm_kr,tpm.prj_create_date ,tpm.prj_modify_date from tb_prj_models tpm left join tb_prj_datasets tpd on tpd.ds_idx =tpm.ds_idx left join tb_groups tg on tpd.grp_idx = tg.grp_idx where tpm.is_valid =1;"

        elif tabel_type == 'tb_users_1': # 사용자 관리 / 시스템 관리자 목록( tup.pms_cd = 1)
            query = "SELECT tu.usr_idx, tu.usr_id, tu.usr_nick, tg.grp_nm_en, tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd where tu.is_valid = 1 and tup.pms_cd = 1 group by tu.usr_idx;"

        elif tabel_type == 'tb_users_2':  # 사용자 관리 / 데이터 관리자 목록( tup.pms_cd = 2)
            query = "SELECT tu.usr_idx, tu.usr_id, tu.usr_nick, tg.grp_nm_en, tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd where tu.is_valid =1 and tup.pms_cd = 2 group by tu.usr_idx;"

        elif tabel_type == 'tb_users_3':  # 사용자 관리 / 모델 관리( tup.pms_cd = 3)
            query = "SELECT tu.usr_idx, tu.usr_id, tu.usr_nick, tg.grp_nm_en, tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd where tu.is_valid =1 and tup.pms_cd = 3 group by tu.usr_idx;"

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


def db_data_set_detail(mariadb_pool,dataset_idx):
    """
    데이터셋 상세 정보 조회
    @param mariadb_pool:
    @param dataset_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select tpd.ds_path, tu.usr_nick from tb_prj_datasets tpd left join tb_usr_inspection tui on tpd.ds_idx = tui.ds_idx left join tb_users tu on tui.usr_idx = tu.usr_idx where tpd.ds_idx = {int(dataset_idx)} and tpd.is_valid =1;"
        cursor.execute(query)
        json_result['data_set_info'] = cursor.fetchall()

        query = f"select tu.usr_nick, tud.ds_idx ,tud.usr_ds_cnt_frame,tud.usr_ds_all_frame , tud.usr_ds_complete ,tud.inp_stat_idx,tsc.stat_cd ,tsc.stat_nm_en ,tsc.stat_nm_kr, tud.inp_stat_desc from tb_usr_datasets tud left join tb_users tu on tud.usr_idx = tu.usr_idx left join tb_usr_inspection tui on tud.ds_idx =tui.ds_idx left join tb_state_code tsc on tud.inp_stat_idx = tsc.stat_idx where tud.ds_idx =  {int(dataset_idx)} ;"
        cursor.execute(query)
        json_result['data_set_labeler_info'] = cursor.fetchall()

        json_result = success_message_json(json_result)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result


# def db_data_set_detail(mariadb_pool,dataset_idx):
#     """
#     데이터셋 상세 정보 조회
#     @param mariadb_pool:
#     @param dataset_idx:
#     @return:
#     """
#     try:
#         json_result = make_response_json([])
#
#         connection = mariadb_pool.get_connection()
#         cursor = connection.cursor()
#
#         query = f"select tpd.ds_path, tu.usr_nick from tb_prj_datasets tpd left join tb_usr_inspection tui on tpd.ds_idx = tui.ds_idx left join tb_users tu on tui.usr_idx = tu.usr_idx where tpd.ds_idx = {int(dataset_idx)} and tpd.is_valid =1;"
#         cursor.execute(query)
#         json_result['data_set_info'] = cursor.fetchall()
#
#         query = f"select tu.usr_nick, tud.ds_idx ,tud.usr_ds_cnt_frame,tud.usr_ds_all_frame , tud.usr_ds_complete ,tud.inp_stat_idx,tsc.stat_cd ,tsc.stat_nm_en ,tsc.stat_nm_kr, tud.inp_stat_desc from tb_usr_datasets tud left join tb_users tu on tud.usr_idx = tu.usr_idx left join tb_usr_inspection tui on tud.ds_idx =tui.ds_idx left join tb_state_code tsc on tud.inp_stat_idx = tsc.stat_idx where tud.ds_idx =  {int(dataset_idx)} ;"
#         cursor.execute(query)
#         json_result['data_set_labeler_info'] = cursor.fetchall()
#
#         json_result = success_message_json(json_result)
#     except Exception as e:
#         print(e)
#         json_result = fail_message_json(json_result)
#
#     finally:
#         if cursor: cursor.close()
#         if connection: connection.close()
#
#         return json_result

def db_model_detail(mariadb_pool, model_idx):
    """
    모델 상세 페이지 내용 조회
    @param mariadb_pool:
    @param model_idx:
    @return:
    """

    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()
        # todo
        # query = f"SELECT tu.usr_nick, tpm.prj_name ,tpm.prj_dev_path FROM tb_prj_models tpm right join tb_dev_prj tdp ON tpm.prj_idx = tdp.prj_idx left join tb_users tu on tu.usr_idx =tdp.usr_idx where tpm.is_valid =1 and tu.is_valid =1 and tpm.prj_idx = {int(model_idx)};"
        query = f"SELECT tu.usr_nick, tpm.prj_name ,tpm.prj_dev_path FROM tb_prj_models tpm right join tb_dev_prj tdp ON tpm.prj_idx = tdp.prj_idx left join tb_users tu on tu.usr_idx =tdp.usr_idx where tpm.is_valid =1 and tu.is_valid =1 ;"

        cursor.execute(query)

        json_result['model_detail_info'] = cursor.fetchall()

        json_result = success_message_json(json_result)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result


def db_get_labeler(mariadb_pool,grp_idx):
    """
    그룹 아이디로 라벨러 조회
    데이터셋 추가 - 그룹(기관)별 라벨러 조회
    figma : 데이터셋 추가_라벨러 추가_팝업에서 라벨러 조회
    @param mariadb_pool:
    @param grp_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select tu.usr_nick from tb_users tu left join tb_usr_permission tup on tu.usr_idx = tup.usr_idx left join tb_groups tg on tu.grp_idx = tg.grp_idx where tup.pms_cd = 4 and tg.grp_idx = {int(grp_idx)};"
        cursor.execute(query)

        json_result['labeler_list'] = cursor.fetchall()

        json_result = success_message_json(json_result)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result


def db_get_devloper(mariadb_pool,grp_idx):
    """
    모델 추가 - 그룹(기관)별 개발자 조회
    figma : 모델 추가_개발자 조회
    @param mariadb_pool:
    @param grp_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select tu.usr_nick from tb_users tu left join tb_usr_permission tup on tu.usr_idx = tup.usr_idx left join tb_groups tg on tu.grp_idx = tg.grp_idx where tup.pms_cd = 6 and tg.grp_idx = {int(grp_idx)};"
        cursor.execute(query)

        json_result['devloper_list'] = cursor.fetchall()

        json_result = success_message_json(json_result)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result

def db_get_dataset(mariadb_pool,grp_idx):
    """
    모델 추가 - 그룹에 속한 데이터셋 조회
    figma : 모델 추가_데이터셋 추가에서 조회
    @param mariadb_pool:
    @param grp_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select DISTINCT tpm.prj_name from tb_users tu join tb_groups tg on tu.grp_idx = tg.grp_idx join tb_dev_prj tdp on tu.usr_idx = tdp.usr_idx join tb_prj_models tpm on tdp.prj_idx = tpm.prj_idx where tg.grp_idx = {int(grp_idx)};"

        cursor.execute(query)

        json_result['dataset_list'] = cursor.fetchall()

        json_result = success_message_json(json_result)
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
