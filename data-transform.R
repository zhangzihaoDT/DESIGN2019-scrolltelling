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
my_data[, c(6:11,12:13)] <- sapply(my_data[, c(6:11,12:13)], as.numeric)
summary(my_data)
install.packages('readr')
library(readr)
library(dplyr)
shuju<-my_data %>% mutate(source=sprintf("[%s,%s]",departure_lng,departure_lat),
         target=sprintf("[%s,%s]",arrival_lng,arrival_lat))
summary(shuju)

regional_airport_top10 <- read.csv("part2-区域机场top10航线.csv",encoding ="UTF-8",stringsAsFactors = FALSE,header = T)
PEK_TSN_flights[, c(6:9)] <- sapply(PEK_TSN_flights[, c(6:9)], as.numeric)
summary(regional_airport_top10)
#去除NA
PEK_TSN_flights[PEK_TSN_flights == "NA"]  <- NA
regional_airport_top10 <- na.omit(regional_airport_top10)
summary(regional_airport_top10)
#CSV转JSON
install.packages('jsonlite')
library(jsonlite)
json_data <- toJSON(regional_airport_top10, pretty = TRUE,force=TRUE)
writeLines(json_data, "regional_airport_top10.json")

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

#处理吞吐量的数据
throughput <- read.csv("2015-2018_passenger_throughput.csv",encoding ="UTF-8",stringsAsFactors = FALSE,header = T)
library(reshape2)
head(throughput)
names(throughput) = c("airport", "2015", "2016", "2017", "2018",'airport_code','airport_lat','airport_lng')
names(throughput)
throughput<-melt(throughput,
                id.vars = c('airport','airport_code','airport_lng','airport_lat'),#需要保留不参与聚合的变量,
                measure.vars = c("2015", "2016", "2017", "2018"),#用于聚合的变量,
                variable.name='year',
                value.name='passenger_throughput')
summary(throughput)
#将文中的NA记录行删除
throughput$passenger_throughput <- as.numeric(throughput$passenger_throughput,throughput$year)
throughput<-na.omit(throughput)
is.na(throughput) #去除
summary(throughput)#现在少了25行
#坐标系变数组
library(readr)
library(dplyr)
throughput<-throughput %>% mutate(position=sprintf("[%s,%s]",airport_lng,airport_lat))
summary(throughput)
class(throughput$year)
throughput$year <- as.numeric(as.character(throughput$year))
summary(throughput)
#导出json
library(jsonlite)
json_data <- toJSON(throughput, pretty = TRUE,force=TRUE)
writeLines(json_data, "throughput.json")

#获得机场的坐标数据和2018年的中心度
Airports <- read.csv("2018_centrality.csv",encoding ="UTF-8",stringsAsFactors = FALSE,header = T)
summary(Airports)
#坐标系变数组
library(readr)
library(dplyr)
Airports <- Airports %>% mutate(position=sprintf("[%s,%s]",airport_lng,airport_lat))
summary(Airports)
library(jsonlite)
json_data <- toJSON(Airports, pretty = TRUE,force=TRUE)
writeLines(json_data, "Airports-2018nodes.json")
#改字段名
colnames(Airports)[colnames(Airports)=="airport_lat"] <- "latitude"
colnames(Airports)[colnames(Airports)=="airport_lng"] <- "longitude"
# Write CSV in R
write.csv(Airports, file = "Airports.csv")

