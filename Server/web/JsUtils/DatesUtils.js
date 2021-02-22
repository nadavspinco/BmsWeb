function localDateTimeToString(localDateTime){
 return LocalDateToString(localDateTime.date)+ ' ' + localTimeToString(localDateTime.time)
}

function localTimeToString(localTime){
 return localTime.hour + ':' +localTime.minute
}

function LocalDateToString(localDate){
 return  localDate.day +'/' +localDate.month+'/' + localDate.year
}