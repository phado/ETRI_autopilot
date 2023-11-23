"""
전체 메뉴의 공통 함수 집합
"""
from db_query import *


def make_response_json(li):
    """
    제이슨 리턴 기본 양식 생성
    :param li:
    :return:
    """
    res_json = {'error': 'False', 'message': '', 'status': '0'}
    if len(li) != 0:
        for _ in li:
            res_json[_] = ''
    return res_json


def success_message_json(dic):
    """
    성공 제이슨 메세지 세팅
    :param dic:
    :return:
    """
    dic['message'] = 'success'
    dic['status'] = '200'
    return dic


def fail_message_json(dic):
    """
    실패시 제이슨 세팅
    :param dic:
    :return:
    """
    dic['error'] = 'Ture'
    dic['message'] = 'Failed'
    dic['status'] = '500'

    return dic


def count_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type):
    """
    게시판 목록을 카운트 하는 함수 board_cnt 안에 수량이 담겨 있다
    @param mariadb_pool:
    @param page_num:
    @param search_type:
    @param search_key_word:
    @param show_data_mount:
    @param usr_id:
    @param tabel_type: 조회할 테이블 명
    @return:
    """
    try:
        json_result = db_count_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result

def get_usr_info(mariadb_pool,usr_id):
    try:
        json_result = db_get_usr_info(mariadb_pool,usr_id)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result


def get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type):
    try:
        json_result = db_mdm_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id,tabel_type)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result



def session_clear(session):
    session.clear()