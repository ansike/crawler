import time
import json
import os
import sys
from ai import zhipuai_chat_completion
# 获取执行命令的目录
current_dir = os.getcwd()
print(current_dir)

arg1 = sys.argv[1]
arg2 = sys.argv[2]
# read_path = os.path.join(current_dir, "./output/products.json")
# save_path = os.path.join(current_dir, "./output/new_products.json")

def process_json_file(read_path, save_path):
    print(read_path)
    print(save_path)
    # 获取开始时间
    start_time = time.time()
    with open(read_path, encoding='utf-8') as file:
        data = json.load(file)

    # 循环处理数据
    for item in data:
        print(item['subTitle'])
        subTitle = zhipuai_chat_completion(item['subTitle'])
        print('=>')
        print(subTitle)
        item['subTitle'] = subTitle
        print('subTitle =======')

        print(item['pmRec'])
        pmRec = zhipuai_chat_completion(item['pmRec'])
        print('=>')
        print(pmRec)
        item['pmRec'] = pmRec
        print('pmRec =======')

        if 'detailDescriptionContentView' in item and 'text' in item['detailDescriptionContentView'] and item['detailDescriptionContentView']['text'] != '' and item['detailDescriptionContentView']['text'].replace('\n', '').replace(' ', '') != '':               
            print(item['detailDescriptionContentView']['text'])
            detailDescriptionContentView = zhipuai_chat_completion(item['detailDescriptionContentView']['text'])
            print('=>')
            print(detailDescriptionContentView)
            item['detailDescriptionContentView']['text'] = detailDescriptionContentView
            print('detailDescriptionContentView =======')

        print('dailyItinerary ==========================')
        for dailyItinerary in item['dailyItinerary']:
            print(dailyItinerary['title'])
            title = zhipuai_chat_completion(dailyItinerary['title'])
            print('=>')
            print(title)
            dailyItinerary['title'] = title
            print('dailyItinerary title ==========================')
            for subItem in dailyItinerary['subItems']:
                if 'rich_content_view' not in subItem:
                    continue
                if subItem['daily_itinerary_sub_tit'] == '早餐' or subItem['daily_itinerary_sub_tit'] == '午餐' or subItem['daily_itinerary_sub_tit'] == '晚餐':
                    continue
                print(subItem['rich_content_view'])
                rich_content_view = zhipuai_chat_completion(subItem['rich_content_view'])
                print('=>')
                print(rich_content_view)
                subItem['rich_content_view'] = rich_content_view

    print(data)
    with open(save_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    # 获取结束时间
    end_time = time.time()
    # 计算时间差（以秒为单位）
    time_diff = end_time - start_time
    print(f"程序执行时间：{time_diff} 秒")

if __name__ == "__main__":
    process_json_file(arg1, arg2)