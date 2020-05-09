export interface IJob {
    jobTitle : String,
    jobType: string, 
    tasks? : Array<String>,
    jobDescription? : String,
    aboutUs? :  String,
    expectations? : Array<String>,
    languages? : Array<String>,
    skills? : Array<String>,
    employer?: any,
    location?: string
}
