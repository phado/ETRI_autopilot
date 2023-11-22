"""
전체 메뉴의 공통 함수 집합
"""


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



def session_clear(session):
    session.clear()