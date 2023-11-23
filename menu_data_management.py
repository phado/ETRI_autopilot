from common_management import *
from db_query import *
"""
데이터 관리 메뉴의 집합  
"""

def mdm_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id):
    try:
        json_result = db_mdm_get_board_list(mariadb_pool, page_num,search_type,search_key_word,show_data_mount,usr_id)

    except Exception as e:
        print(e)
        json_result = fail_message_json(json_result)

    return json_result


