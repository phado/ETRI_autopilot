"""
DB 쿼리 관련 함수 집합
"""
import logging
import traceback
from common_management import make_response_json, success_message_json, fail_message_json

logging.basicConfig(filename='./DB_Query.log', level=logging.ERROR)


def db_login(mariadb_pool, usr_id, usr_pwd):
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


def db_register(mariadb_pool, usr_id, usr_nick_name, usr_pwd, usr_name, usr_phone, usr_email, usr_agency):
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

def db_changePermission(mariadb_pool, permissions, usr_idx):
    """
    권한 설정
    """
    reg_json_result = make_response_json([])
    connection = None
    cursor = None

    try:
        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        # 사용자의 모든 권한 삭제
        delete_query = "DELETE FROM tb_usr_permission WHERE usr_idx = %(usr_idx)s"
        cursor.execute(delete_query, {"usr_idx": usr_idx})

        # 새로운 권한 추가
        insert_query = "INSERT INTO tb_usr_permission (usr_idx, pms_cd) VALUES (%(usr_idx)s, %(permission)s)"
        for permission in permissions:
            cursor.execute(insert_query, {"usr_idx": usr_idx, "permission": permission})

        connection.commit()
        reg_json_result = success_message_json(reg_json_result)

    except Exception as e:
        print(e)
        reg_json_result = fail_message_json(reg_json_result)
        if connection:
            connection.rollback()

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

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
        if connection: connection.close()

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


def db_reset_pwd(mariadb_pool, new_pwd, usr_idx):
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
        query = f"update tb_users tu set tu.usr_pw='{new_pwd}' where tu.usr_idx ='{usr_idx}';"
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

def db_secession_user(mariadb_pool, usr_idx):
    """
    유저 탈퇴 
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()

        cursor = connection.cursor()

        query =  f"UPDATE tb_users SET is_valid = 0 WHERE usr_idx = {usr_idx};"
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


def db_get_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount, usr_id, tabel_type, usr_nick, grp_nm_en):
    """
    데이터 관리 게시판 목록
    @param tabel_type: 조회할 테이블의 이름!!
    @param mariadb_pool:
    @param page_num:
    @param search_type:
    @param search_key_word:
    @param show_data_mount:
    @param usr_id:
    @param tabel_type:
    @param usr_nick:
    @param grp_nm_en:
    @return:
    """
    try:

        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = ''
        if tabel_type == 'tb_prj_datasets':  # 데이터 관리 목록 조회
            query = f"SELECT tpd.ds_idx ,tpd.ds_name , tg.grp_nm_en ,tg.grp_nm_kr , tds.lb_stat_idx, tds.inp_stat_idx , tpd.ds_create_date ,tpd.ds_modify_date, tpd.ds_cnt_frame ,tpd.ds_all_frame from tb_prj_datasets tpd left join tb_groups tg     ON tpd.grp_idx =tg.grp_idx left join tb_datasets_state tds     on tds.ds_idx =tpd.ds_idx left join tb_usr_datasets tud     on tud.usr_idx = tpd.ds_idx left join tb_users tu     on tu.grp_idx = tg.grp_idx left join tb_usr_permission tup     on tu.usr_idx = tup.usr_idx WHERE tpd.is_valid =1     AND tg.grp_nm_en='{grp_nm_en}'    AND tu.usr_nick='{usr_nick}';"
            # query = "SELECT tpd.ds_idx ,tpd.ds_name , tg.grp_nm_en ,tg.grp_nm_kr , tds.lb_stat_idx, tds.inp_stat_idx , tpd.ds_create_date ,tpd.ds_modify_date, tpd.ds_cnt_frame ,tpd.ds_all_frame from tb_prj_datasets tpd left join tb_groups tg     ON tpd.grp_idx =tg.grp_idx left join tb_datasets_state tds     on tds.ds_idx =tpd.ds_idx left join tb_usr_datasets tud     on tud.usr_idx = tpd.ds_idx left join tb_users tu     on tu.grp_idx = tg.grp_idx left join tb_usr_permission tup     on tu.usr_idx = tup.usr_idx WHERE tpd.is_valid =1     AND tg.grp_nm_en='etri'    AND tu.usr_nick='jin'    AND tup.pms_cd = 4;" todo 페이지 분리되면 pms_cd를 적용 해서 라벨러,검수자,관리자 구분
        elif tabel_type == 'tb_prj_models':  # '모델 관리 목록 조회'
            query = "SELECT tpm.prj_idx, tpm.prj_name, tg.grp_nm_en, tg.grp_nm_kr, tpd.ds_name,tpm.prj_create_date, tpm.prj_modify_date FROM tb_prj_models tpm LEFT JOIN tb_prj_datasets tpd ON tpd.ds_idx = tpm.ds_idx LEFT JOIN tb_groups tg ON tpd.grp_idx = tg.grp_idx WHERE tpm.is_valid = 1;"

        elif tabel_type == 'tb_users_1':  # 사용자 관리 / 시스템 관리자 목록( tup.pms_cd = 1)
            query = "SELECT tu.usr_idx, tu.usr_id, tu.usr_nick, tg.grp_nm_en, tu.usr_nm,tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd where tu.is_valid = 1 and tup.pms_cd = 1 group by tu.usr_idx;"

        elif tabel_type == 'tb_users_2':  # 사용자 관리 / 데이터 관리자 목록( tup.pms_cd = 2)
            query = "SELECT tu.usr_idx, tu.usr_id, tu.usr_nick, tg.grp_nm_en,tu.usr_nm, tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd where tu.is_valid =1 and tup.pms_cd = 2 group by tu.usr_idx;"

        elif tabel_type == 'tb_users_3':  # 사용자 관리 / 모델 관리( tup.pms_cd = 3)
            query = "SELECT tu.usr_idx, tu.usr_id, tu.usr_nick, tg.grp_nm_en, tu.usr_nm, tu.usr_tel, tu.usr_mail, group_concat(tcp.name) as name, group_concat(tup.pms_cd) as pms_cd, tu.usr_last_date from tb_users tu left join tb_groups tg ON tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx left join tb_cmn_permission tcp on tup.pms_cd =tcp.pms_cd where tu.is_valid =1 and tup.pms_cd = 3 group by tu.usr_idx;"

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


def db_count_board_list(mariadb_pool, page_num, search_type, search_key_word, show_data_mount, usr_id, tabel_type, usr_nick, grp_nm_en):
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


def db_get_usr_info(mariadb_pool, usr_id):
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


def db_data_set_detail(mariadb_pool, dataset_idx):
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

        query = f"select tu.usr_nick,tud.ds_idx ,tud.usr_ds_cnt_frame, tud.usr_ds_all_frame ,  tud.usr_ds_complete , tsc.stat_idx,  tud.inp_stat_desc from tb_usr_datasets tud left join tb_users tu on tud.usr_idx = tu.usr_idx left join tb_usr_inspection tui on tud.ds_idx = tui.ds_idx left join tb_state_code tsc on tud.inp_stat_idx = tsc.stat_idx  WHERE tud.ds_idx = {int(dataset_idx)};"
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
        query = f"SELECT tu.usr_nick, tpm.prj_name ,tpm.prj_dev_path, tpm.prj_dev_airflow_path, tpm.prj_dev_mlflow_path FROM tb_prj_models tpm right join tb_dev_prj tdp ON tpm.prj_idx = tdp.prj_idx left join tb_users tu on tu.usr_idx =tdp.usr_idx where tpm.is_valid =1 and tu.is_valid =1;"

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


def db_get_labeler(mariadb_pool, grp_idx):
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


def db_get_inspector(mariadb_pool, grp_idx):
    """
    그룹 아이디로 검수자 조회
    데이터셋 추가 - 그룹(기관)별 검수자 조회
    figma : 데이터셋 추가_라벨러 추가_팝업에서 검수자 조회
    @param mariadb_pool:
    @param grp_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select tu.usr_nick     from tb_users tu left join tb_usr_permission tup     on tu.usr_idx = tup.usr_idx left join tb_groups tg     on tu.grp_idx = tg.grp_idx where tup.pms_cd = 5 and tg.grp_idx = {int(grp_idx)};"  # 5 검수 4 라벨   grp_idx그룹 인덱스
        query = f"select tu.usr_nick     from tb_users tu left join tb_usr_permission tup     on tu.usr_idx = tup.usr_idx left join tb_groups tg     on tu.grp_idx = tg.grp_idx where tup.pms_cd = 5 and tg.grp_idx = 0;"  # 5 검수 4 라벨   grp_idx그룹 인덱스 일단 전체 조회 todo 고정 값 변경 해야함
        cursor.execute(query)

        json_result['inspector_list'] = cursor.fetchall()

        json_result = success_message_json(json_result)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result


def db_get_devloper(mariadb_pool, grp_idx):
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


def db_get_dataset(mariadb_pool, grp_idx):
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


def db_change_confirm_done(mariadb_pool, usr_nick, ds_name):
    """
    데이터셋 상세 페이지에서 검수가 완료 버튼 클릭 이벤트
    쿼리 1 : 닉네임과 데이터 셋 이름으로 유저 정보와 데이터셋 인덱스 구한다.
    쿼리 2 : 1 로 구한 데이터셋 인덱스와 유저 인덱스로 라벨 검수 완려 설정
    쿼리 3 : 라벨러 업데이트된 상태 조회해서 담는다.
    쿼리 4 : 프로젝트에 라벨러들 전부 카운트
    쿼리 5 : 프로젝트에 라벨러 중에 검수 완료 전부 카운트
    쿼리 6 : 프로젝트가 전부 검수 완료 라면 프로젝트 라벨 완료 상태 변경 아니면 패스

    @param mariadb_pool:
    @param grp_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()
        # 쿼리1
        query = f"""SELECT tbd.ds_idx, tbd.usr_idx 
                    FROM tb_usr_datasets AS tbd 
                    LEFT JOIN tb_prj_datasets AS tpd
                    ON tbd.ds_idx = tpd.ds_idx 
                    LEFT JOIN tb_users 
                    AS tu ON tbd.usr_idx = tu.usr_idx 
                    WHERE tu.usr_nick='{usr_nick}' AND tpd.ds_name='{ds_name}'; """
        cursor.execute(query)

        # 쿼리2
        ds_idx, usr_idx = cursor.fetchall()[0]
        query = f"""UPDATE
                        tb_usr_datasets
                    SET
                        inp_stat_idx = '3'
                    WHERE
                        ds_idx = {ds_idx}
                    AND
                        usr_idx = {usr_idx};"""
        cursor.execute(query)

        try:
            connection.commit()
        except:
            if connection: connection.rollback()

        # 쿼리3
        query = f"""select
                        tu.usr_nick,
                        tud.ds_idx ,
                        tud.inp_stat_idx
                    from
                        tb_usr_datasets tud
                    left join tb_users tu on
                        tud.usr_idx = tu.usr_idx
                    left join tb_usr_inspection tui on
                        tud.ds_idx = tui.ds_idx
                    left join tb_state_code tsc on
                        tud.inp_stat_idx = tsc.stat_idx
                    WHERE
                        tud.ds_idx = {ds_idx}
                    and tu.usr_idx = {usr_idx};"""

        cursor.execute(query)
        fixed_labeler = cursor.fetchall()

        json_result['fixed_labeler'] = fixed_labeler
        json_result = success_message_json(json_result)

        # 쿼리 4
        query = f"""select
                        COUNT(*)
                    from
                        tb_usr_datasets tud
                    left join tb_users tu on
                        tud.usr_idx = tu.usr_idx
                    left join tb_usr_inspection tui on
                        tud.ds_idx = tui.ds_idx
                    left join tb_state_code tsc on
                        tud.inp_stat_idx = tsc.stat_idx
                    WHERE
                        tud.ds_idx = {ds_idx};"""
        cursor.execute(query)
        cnt_total_labeler = cursor.fetchall()[0][0]

        # 쿼리 5
        query = f"""select
                        COUNT(*)
                    from
                        tb_usr_datasets tud
                    left join tb_users tu on
                        tud.usr_idx = tu.usr_idx
                    left join tb_usr_inspection tui on
                        tud.ds_idx = tui.ds_idx
                    left join tb_state_code tsc on
                        tud.inp_stat_idx = tsc.stat_idx
                    WHERE
                        tud.ds_idx = {ds_idx}
                    AND
                        tsc.stat_nm_kr = '검수 완료';"""
        cursor.execute(query)
        cnt_done_confirm = cursor.fetchall()[0][0]

        if cnt_total_labeler == cnt_done_confirm:
            # 쿼리 6
            query = f"""UPDATE tb_datasets_state 
                        SET inp_stat_idx='3' 
                        WHERE ds_idx= {ds_idx};"""
            cursor.execute(query)
            json_result['dataset_confrim_fixed'] = '1'
            try:
                connection.commit()
            except:
                if connection: connection.rollback()
        json_result['dataset_confrim_fixed'] = '0'
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result


def db_change_labeling_done(mariadb_pool, usr_nick, ds_name):
    """
    데이터셋 상세 페이지에서 라벨링이 완료 버튼 클릭 이벤트
    쿼리 1 : 닉네임과 데이터 셋 이름으로 유저 정보와 데이터셋 인덱스 구한다.
    쿼리 2 : 1 로 구한 데이터셋 인덱스와 유저 인덱스로 진행완료 상태를 라벨링 완료로 변경 한다
    쿼리 3 : 라벨러 업데이트된 상태 조회해서 담는다.
    쿼리 4 : 프로젝트에 라벨러들 전부 카운트
    쿼리 5 : 프로젝트에 라벨러 중에 라벨링 완료 전부 카운트
    쿼리 6 : 프로젝트가 전부 라벨링 완료 라면 프로젝트 상태에 작업상태를 라벨링완료로 변경

    @param mariadb_pool:
    @param grp_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()
        # 쿼리1
        query = f"""SELECT tbd.ds_idx, tbd.usr_idx 
                    FROM tb_usr_datasets 
                    AS tbd 
                    LEFT JOIN tb_prj_datasets 
                    AS tpd
                    ON tbd.ds_idx = tpd.ds_idx 
                    LEFT JOIN tb_users 
                    AS tu ON tbd.usr_idx = tu.usr_idx 
                    WHERE tu.usr_nick='{usr_nick}' AND tpd.ds_name='{ds_name}'; """
        cursor.execute(query)
        ds_idx, usr_idx = cursor.fetchall()[0]

        # 쿼리2
        query = f"""UPDATE
                        tb_usr_datasets
                    SET
                        usr_ds_complete = '1'
                    WHERE
                        ds_idx = {ds_idx}
                    AND
                        usr_idx = {usr_idx};"""
        cursor.execute(query)

        try:
            connection.commit()
        except:
            if connection: connection.rollback()

        # 쿼리3
        query = f"""select
                        tu.usr_nick,
                        tud.ds_idx ,
                        tud.usr_ds_complete
                    from
                        tb_usr_datasets tud
                    left join tb_users tu on
                        tud.usr_idx = tu.usr_idx
                    left join tb_usr_inspection tui on
                        tud.ds_idx = tui.ds_idx
                    left join tb_state_code tsc on
                        tud.inp_stat_idx = tsc.stat_idx
                    WHERE
                        tud.ds_idx = {ds_idx}
                        and tu.usr_idx = {usr_idx};"""

        cursor.execute(query)
        fixed_labeler = cursor.fetchall()

        json_result['fixed_labeler'] = fixed_labeler
        json_result = success_message_json(json_result)

        # 쿼리 4
        query = f"""select
                        COUNT(*)
                    from
                        tb_usr_datasets tud
                    left join tb_users tu on
                        tud.usr_idx = tu.usr_idx
                    left join tb_usr_inspection tui on
                        tud.ds_idx = tui.ds_idx
                    left join tb_state_code tsc on
                        tud.inp_stat_idx = tsc.stat_idx
                    WHERE
                        tud.ds_idx = {ds_idx};"""
        cursor.execute(query)
        cnt_total_labeler = cursor.fetchall()[0][0]

        # 쿼리 5
        query = f"""select
                        COUNT(tud.usr_ds_complete)
                    from
                        tb_usr_datasets tud
                    left join tb_users tu on
                        tud.usr_idx = tu.usr_idx
                    WHERE
                        tud.ds_idx = {ds_idx}
                    and 
                        tud.usr_ds_complete = 1;"""
        cursor.execute(query)
        cnt_done_labeler = cursor.fetchall()[0][0]

        if cnt_total_labeler == cnt_done_labeler:
            # 쿼리 6
            query = f"""UPDATE
                            tb_datasets_state
                        SET
                            lb_stat_idx = '1'
                        WHERE ds_idx= {ds_idx};"""
            cursor.execute(query)

            try:
                connection.commit()
                json_result['dataset_labeled_fixed'] = '1'
            except:
                if connection: connection.rollback()

        json_result['dataset_labeled_fixed'] = '0'

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result

def db_systemManager_detail(mariadb_pool, managerIdx):
    """
    시스템 관리자 상세 정보 조회
    @param mariadb_pool:
    @param dataset_idx:
    @return:
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"select tu.usr_id, tu.usr_nick, tg.grp_nm_en, tu.usr_nm, tu.usr_tel, tu.usr_mail, group_concat(tup.pms_cd),tu.usr_idx as pms_cd from tb_users tu left join tb_groups tg on tu.grp_idx = tg.grp_idx left join tb_usr_permission tup on tup.usr_idx = tu.usr_idx where tu.usr_idx = {int(managerIdx)} group by tu.usr_idx;"
        cursor.execute(query)
        json_result['systemManagerInfo'] = cursor.fetchall()

        json_result = success_message_json(json_result)
    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    finally:
        if cursor: cursor.close()
        if connection: connection.close()

        return json_result
    

def db_get_user_info(mariadb_pool, usr_idx):
    """
    유저 인덱스로 로그인 프로필에서 정보 확인 
    """
    try:
        json_result = make_response_json([])

        connection = mariadb_pool.get_connection()
        cursor = connection.cursor()

        query = f"SELECT tb_users.usr_id, tb_users.usr_nick, tb_users.usr_nm, tb_users.usr_tel, tb_users.usr_mail, tb_groups.grp_nm_en FROM tb_users JOIN tb_groups ON tb_users.grp_idx = tb_groups.grp_idx WHERE tb_users.usr_idx = {int(usr_idx)};"

        cursor.execute(query)

        json_result['userInfo'] = cursor.fetchall()

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
