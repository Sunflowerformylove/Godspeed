const fs = require("fs");
const path = require("path");
const { dirname } = require("path");

class BadWord{
    Language = "VN" // VN, EN
    Reader
    BlackList
    WhiteList
    constructor(){
        if(this.Language == "VN"){
            this.Reader = fs.readFileSync(path.join(__dirname, "/Docs/vn_offensive_words.txt"));
        }
        else if(this.Language == "EN"){
            this.Reader = fs.readFileSync(path.join(__dirname, "/Docs/en_offensive_words.txt"));
        }
        this.BlackList = this.Reader.toString().split("\n");
        this.WhiteList = [];
    }
    SetLang(Language){
        this.Language = Language;
        if(this.Language == "VN"){
            this.Reader = fs.readFileSync(path.join(__dirname, "/Docs/vn_offensive_words.txt"))
        }
        else if(this.Language == "EN"){
            this.Reader = fs.readFileSync(path.join(__dirname, "/Docs/en_offensive_words.txt"));
        }
        this.BlackList = this.Reader.toString().split("\n");
    }
    GetLang(){
        return this.Language;
    }
    CheckBadWord(Text){
        let Result = false
        this.BlackList.forEach(word => {
            if(Text.includes(word) && !this.WhiteList.includes(word)){ 
                Result = true;
            }
        })
        return Result;
    }
    Clean(Text){
        let Result = Text
        for(let i = 0; i < this.BlackList.length; i++){
            if(Text.includes(this.BlackList[i]) && !this.WhiteList.includes(this.BlackList[i])){
                Result = Result.replace(this.BlackList[i], "***");
            }
        }
        return Result;
    }
    // Clean(Text, Replace){
    //     let Result = Text
    //     if(this.WhiteList.includes(Replace)){
    //         return Result;
    //     }
    //     else{
    //         this.BadWord.forEach(word => {
    //             Result = Result.replace(word, Replace);
    //         })
    //     }
    //     return Result;
    // }
    Count(Text){
        let Result = 0
        this.BadWord.forEach(word => {
            if(Text.includes(word)){
                Result++;
            }
        })
        return Result;
    }
    WhiteList(Word){
        this.WhiteList.push(Word);
    }
    BlackList(Word){
        this.BlackList.push(Word);
    }
    RemoveWhiteList(Word){
        this.WhiteList.splice(this.WhiteList.indexOf(Word), 1);
    }
    RemoveBlackList(Word){
        this.BlackList.splice(this.BlackList.indexOf(Word), 1);
    }
    GetWhiteList(){
        return this.WhiteList;
    }
    GetBlackList(){
        return this.BlackList;
    }
    SetWhiteList(WhiteList){
        this.WhiteList = WhiteList;
    }
    SetBlackList(BlackList){
        this.BlackList = BlackList;
    }
};

module.exports = BadWord;