import moment from "moment";
import { UserDocument } from "../model/User";

export function formatDate (date:Date , format:any){
    return moment(date).format(format)
}

export function truncate (str:string , len:number){
    if (str.length > len && str.length > 0){
        let new_str = str + " "
        new_str = str.substr(0 , len)
        new_str = str.substr(0 , new_str.lastIndexOf(" "))
        new_str  = new_str.length > 0 ? new_str : str.substr(0, len)
        return new_str + "..."
    }
    return str
}

export function stripTags (input:string){
    return input.replace(/<(?:.|\n)*?>/gm, "")
}

export function editIcon (storyUser:UserDocument , loggedUser:UserDocument , storyId:string , floating = true){
    console.log(storyUser , "===========================>")
    if(storyUser._id.toString() == loggedUser._id.toString()){
        if(floating){
            return ` <a href="/stories/edit/${storyId}" class="btn-floating halfway-fab black">
                <i class="fas fa-edit fa-small"></i>
            </a>`
        }else{
            return `<a href="/stories/edit/${storyId}">
                <i class="fas fa-edit"></i>
            </a>`
        }
    }else{
        return ""
    }
}