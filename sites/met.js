"use strict"

const scraper = require("../peviitor_scraper.js");
const uuid = require('uuid');

const url = "https://api.smartrecruiters.com/v1/companies/metgroup/postings?limit=100&country=ro";

const company = {"company":"METGroup"};
let finalJobs = [];

const s = new scraper.ApiScraper(url);

s.get().then((response) => {
    const jobs = response.content;

    jobs.forEach(job => {
        const id = uuid.v4();
        const job_title = job.name;
        const job_link = "https://jobs.smartrecruiters.com/METGroup/" + job.id;
        const company = "METGroup";
        const city = job.location.city;
        const country = "Romania";

        console.log(job_title + " -> " + city);
        
        const j = {
            "id": id,
            "job_title": job_title,
            "job_link": job_link,
            "company": company,
            "city": city,
            "country": country
        };

        finalJobs.push(j);
    });
}).then(() => {
    console.log("Total jobs: " + finalJobs.length);

    const apiKey = "182b157-bb68-e3c5-5146-5f27dcd7a4c8";
    const postPeviitor = scraper.postApiPeViitor(apiKey, finalJobs, company);

    let logo = "https://group.met.com/media/3f4d1h1o/met-logo.svg";

    let postLogo = new scraper.ApiScraper(
      "https://api.peviitor.ro/v1/logo/add/"
    );
    postLogo.headers.headers["Content-Type"] = "application/json";
    postLogo.post(JSON.stringify([{ id: "METGroup", logo: logo }]));
});