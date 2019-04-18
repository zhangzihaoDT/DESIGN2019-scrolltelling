# 首先找出工作目录的设置位置：
getwd()
#更改返回的路径
setwd("/Applications/XAMPP/xamppfiles/htdocs/volat-economy-scrollmagic/data")
my_data <- read.csv("Airline&Centrality.csv",encoding ="UTF-8",stringsAsFactors = FALSE,header = T)
summary(my_data)
install.packages('jsonlite')
library(jsonlite)
json_data <- toJSON(my_data, pretty = TRUE)
writeLines(json_data, "my_data.json")

head(my_data)
#计算机场的航线数量
library(plyr)
cnt <- count(my_data, 'departure')
library(ggplot2)
library(magrittr)
library(ggpubr)
theme_set(theme_pubr())

ggplot(cnt, aes(x = departure, y = freq)) +
  geom_bar(fill = "#0073C2FF", stat = "identity") +
  geom_text(aes(label = freq), vjust = -0.3) +
  theme_pubclean()
