export interface IJob {
    jobTitle : String,
    jobType: string, 
    tasks? : Array<String>,
    jobDescription? : String,
    aboutUs? :  String,
    location?: String,
    companyUrl?:String,
    companyLogo?: String,
    companyName? : String
    expectations? : Array<String>,
    languages? : Array<String>,
    skills? : Array<String>
}
