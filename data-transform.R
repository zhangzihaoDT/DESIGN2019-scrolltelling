# 首先找出工作目录的设置位置：
getwd()
#更改返回的路径
setwd("/Users/smg/Desktop/volat-economy-scrollmagic/data/")
my_data <- read.csv("Airline&Centrality_逆向匹配.csv",encoding ="UTF-8",stringsAsFactors = FALSE,header = T)
summary(my_data)
#去除NA
my_data[my_data == "#N/A"]  <- NA
my_data <- na.omit(my_data)
summary(my_data)
#character转numeric
#my_data$flights_in <- as.numeric(as.character(my_data$flights_in))
my_data[, c(6:11,13)] <- sapply(my_data[, c(6:11,13)], as.numeric)
summary(my_data)
install.packages('readr')
library(readr)
library(dplyr)
shuju<-my_data %>% mutate(source=sprintf("[%s,%s]",departure_lng,departure_lat),
         target=sprintf("[%s,%s]",arrival_lng,arrival_lat))
summary(shuju)

#CSV转JSON
install.packages('jsonlite')
library(jsonlite)
json_data <- toJSON(shuju, pretty = TRUE,force=TRUE)
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


