import os
from zhipuai import ZhipuAI
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

# 读取环境变量
api_key = os.getenv('ZHIPU_API_KEY')
print(api_key)

client = ZhipuAI(api_key=api_key)

def zhipuai_chat_completion(str):
    try:
        response = client.chat.completions.create(
            model="glm-4",
            messages=[
                {"role": "system", "content": "You are the copywriting assistant adjusting the wording of the copy, do not modify the overall meaning, only use Chinese, and the modified copy cannot have more characters than the original. The output format should be consistent with the input format, as long as the result is irrelevant information, do not output!!!"},
                {"role": "user", "content": str},
            ],
        )

        # print(response)

        return response.choices[0].message.content.strip("`plaintext").strip()

    except Exception as e:
        print(f"An error occurred: {e} \n {str}")
        return str

# zhipuai_chat_completion('''【发掘迪士尼小镇的魅力】：
#         当您四处寻找商品、美食，享受美好时光时，好似穿越到20世纪初！迪士尼小镇各区域古朴雅致，多元别致，对每个人来说都有其独特之处。这个令人愉悦、魅力非凡的地方将带给您前所未有的体验，您既可以沉浸在回忆中，同时期待充满无限可能的未来。
        
#         迪士尼小镇坐落于上海迪士尼乐园外沿，濒临星愿湖畔，向各地游客传达欢乐的精神，即分享与享受生活所给予的一切。餐厅老板、店主到音乐家和表演者等友好的小镇“居民们”，聚集在小镇中心的街道上迎接欢乐的游客和热情的访客，为他们提供优质的服务。
        
#         穿过小镇市集，来到摩肩接踵的百老汇广场，这里的商铺和购物商场多得令人目不暇接。沉醉于美不胜收的迪士尼小镇湖畔，并享受可口美食。或者，到颇具当地风情的百食香街享受生活，游客围坐在桌前，营造出诱人的温馨氛围。
        
#         尽情在 “迪士尼世界商店”挑选商品吧。从上到下，您将被迪士尼商品环绕，包括服装、配饰、饰品、电子产品、玩具、收藏品、徽章、毛绒玩具，应有尽有。''')