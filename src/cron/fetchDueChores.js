const moment = require('moment')
const { NO_RECORDS_FOUND } = require('../config/messages')
const { Chore, ChoresHistory } = require("../models")
const { notifications } = require('../config/config')
const createNotifications = require('../helpers/microservice-connection/createNotifications')

const fetchDueChores = async () => {
try{
    // fetch chores w.r.t current day 
    const currentDay = moment().format('dddd').toLowerCase()
    const currentDate = moment(moment().format('YYYY-MM-DD 00:00:00'))
   
    let validChores = [], promise = []
    
    const weeklyChores = await Chore.find({
        days: currentDay,
        choreType:'weekly'
       
    }).select(["uid", "days", "choreType", "autoApprove"]).lean() 

    // if no record found return error
    if(!weeklyChores.length) throw new Error(NO_RECORDS_FOUND);

    // filter chores who have current day as last assigned day
    weeklyChores.map(( chores ) => {
        let isValidChore
        chores.days.map((value) => {  

            const choreDate = moment(moment().day(value).format('YYYY-MM-DD 00:00:00'))
            const date = choreDate.isAfter(currentDate)

            isValidChore = date ? false : true 
        })
        if(isValidChore){
            validChores.push(chores)
            return validChores
        }
    })

    // filter chore that are not existing in choreHistory and send notification
    for ( filteredChores of validChores) {
      
        let dueChores
        const week = currentDate.week()

        dueChores = await ChoresHistory.findOne({
            choreId : filteredChores._id,
            week: week
        })
        if(!dueChores) {
            const notification = {
                uid: filteredChores.uid,
                title: notifications.weekly_chore_due.title,
                description: notifications.weekly_chore_due.description,
                notificationType:notifications.weekly_chore_due.type
            }
            promise.push(createNotifications(null, [notification]))
        } 
    }
   
    await Promise.all(promise)
   
}catch (error) {
    console.log(error,'error')
}
}
module.exports = fetchDueChores