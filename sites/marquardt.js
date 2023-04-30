"use strict";

const scraper = require("../peviitor_scraper.js");
const uuid = require("uuid");

const url =
  "https://marquardt-group.csod.com/ux/ats/careersite/5/home?c=marquardt-group&country=ro";

const company = { company: "Marquardt" };

const s = new scraper.Scraper(url);

s.soup.then((soup) => {
  const scripts = soup.findAll("script", { type: "text/javascript" });

  let pattern = /"token":(.*),/g;

  let token;

  scripts.forEach((script) => {
    let match = script.text.match(pattern);

    if (match) {
      token = match[0].split(":")[1].split(",")[0].replace(/"/g, "");
    }
  });

  const apiurl = "https://uk.api.csod.com/rec-job-search/external/jobs";

  const data = {
    careerSiteId: 5,
    careerSitePageId: 5,
    pageNumber: 1,
    pageSize: 1000,
    cultureId: 1,
    searchText: "",
    cultureName: "en-US",
    states: [],
    countryCodes: ["ro"],
    cities: [],
    placeID: "",
    radius: null,
    postingsWithinDays: null,
    customFieldCheckboxKeys: [],
    customFieldDropdowns: [],
    customFieldRadios: [],
  };

    const api = new scraper.ApiScraper(apiurl);

    api.headers.headers["Authorization"] = "Bearer " + token;

    let finalJobs = [];

    api.post(data).then((d) => {
        const jobs = d.data.requisitions;
        
        jobs.forEach((job) => {
            const id = uuid.v4();
            const job_title = job.displayJobTitle;
            const job_link = "https://marquardt-group.csod.com/ux/ats/careersite/5/home/requisition/" + job.requisitionId + "?c=marquardt-group";
            const country = "Romania";
            const city = job.locations[0].city;
            const company = "Marquardt";

            console.log(job_title + " -> " + city);

            const jobObj = {
                id: id,
                job_title: job_title,
                job_link: job_link,
                country: country,
                city: city,
                company: company,
            };

            finalJobs.push(jobObj);
        });
    }).then(() => {
        console.log("Total jobs: " + finalJobs.length);

        const apiKey = "182b157-bb68-e3c5-5146-5f27dcd7a4c8";
      const postPeviitor = scraper.postApiPeViitor(apiKey, finalJobs, company);

      let logo =
        "https://upload.wikimedia.org/wikipedia/commons/0/03/MarquardtGroup-Logo-CIColor-on-Transparent.svg";

      let postLogo = new scraper.ApiScraper(
        "https://api.peviitor.ro/v1/logo/add/"
      );
      postLogo.headers.headers["Content-Type"] = "application/json";
      postLogo.post(JSON.stringify([{ id: "Marquardt", logo: logo }]));
    });

});
