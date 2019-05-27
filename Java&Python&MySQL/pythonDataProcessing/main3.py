import pandas as pd
import numpy as np
import re

data = pd.read_csv('data.csv')
years = pd.read_csv('years.csv')

data = data.values
years = years.values

res = []
for year in years:
    yd = []
    yd_view = []
    for d in data:
        if d[1] == year:
            yd.append(d)
            yd_view.append(d[3])
    for i in range(10):
        if len(yd_view) > i:
            res.append(yd[np.argsort(yd_view)[-(i + 1)]])
    # l1 = np.argsort(yd_view)[-1]
    # l2 = np.argsort(yd_view)[-2]
    # l3 = np.argsort(yd_view)[-3]
    # res.append(yd[l1])
    # res.append(yd[l2])
    # res.append(yd[l3])
    # if len(yd_view) > 3:
    #     l4 = np.argsort(yd_view)[-4]
    #     l5 = np.argsort(yd_view)[-5]
    #     res.append(yd[l4])
    #     res.append(yd[l5])

data = pd.DataFrame(res, columns=["id", "year", "tag_name", "views", "related topic1", "view of topic1",
                                         "related topic2", "view of topic2", "related topic3", "view of topic3"])
data.to_csv('full_data.csv')