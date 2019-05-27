import pandas as pd
import numpy as np
import re

topic = pd.read_csv('topics.csv')
data = pd.read_csv('tag_f.csv')
ted = pd.read_csv('TED.csv')
tags = pd.read_csv('tag.csv')

topic = topic.values
data = data.values
ted = ted.values
tags = tags.values

final_data = []
for d in data:
    dd = []
    myTag = d[2]
    print(myTag)
    myYear = d[1]
    mySibling = []
    mySiblingData = []
    for ts in tags:
        if ts[0] == myYear and ts[1] != myTag:
            mySibling.append(ts[1])
    for sb in mySibling:
        myView = 0
        for td in ted:
            if td[1] == myYear and re.findall(myTag.lower(), td[3]) and re.findall(sb.lower(), td[3]):
                myView += int(td[2])
        mySiblingData.append(myView)
    l1 = np.argsort(mySiblingData)[-1]
    l2 = np.argsort(mySiblingData)[-2]
    l3 = np.argsort(mySiblingData)[-3]
    dd.append(myYear)
    dd.append(myTag)
    dd.append(int(d[3]))
    dd.append(mySibling[l1])
    dd.append(mySiblingData[l1])
    dd.append(mySibling[l2])
    dd.append(mySiblingData[l2])
    dd.append(mySibling[l3])
    dd.append(mySiblingData[l3])
    final_data.append(dd)

data = pd.DataFrame(final_data, columns=["year", "tag_name", "views", "related topic1", "view of topic1",
                                         "related topic2", "view of topic2", "related topic3", "view of topic3"])
data.to_csv('data.csv')

