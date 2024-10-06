Information portal for experts

Description
The Expert Information Portal is a web application designed to bring together experts in various fields to share knowledge and experience. The portal provides convenient tools for searching for information, interacting with other experts and publishing articles.

Project functionality
- Registration and authentication of users (experts).
- Sections for publishing and reading articles.
- Comments and ratings.
- Search by experts and articles.
- Administrative panel for content management

Requirements
- Front-end: React, HTML5, CSS3, JavaScript.
- Back-end: Node.js, Express, MongoDB.
- Additional tools: Postman for API testing, Jenkins for CI/CD, Selenium for test automation.
Project installation

1. Clone the repository:
  
git clone https://github.com/username/expert-portal.git

2. Go to the project folder and install dependencies:

 cd expert-portal
   npm install

3. Launch the project:

npm start

Testing

1. Test planning and control
   - As part of testing, a state transition diagram was created to analyze states and transitions in the system (for example, from user registration to article publication).
   - The test plan describes the types of tests: functional, integration and load.
   - Tests cover basic user scenarios: registration, article search, interaction with content.
2. Automated tests
   - To automate tests, Selenium WebDriver was used for browser testing.
   - Running autotests:
npm run test
3. Test documentation
   - Test Link contains a list of all tests and their statuses.
   - Test statuses are tracked in a test management system.
4. Bug Reports
   - If errors were identified, they were recorded in Jira. A complete list of bug reports and their statuses can be found at (https://ait-learn.atlassian.net/jira/software/projects/PLAT/boards/78).

Known Bugs
- When working with certain versions of browsers, problems with displaying content may occur.
- Errors may occur when registering with non-standard email domains.

Authors and contacts
- Front-end developers: [Alena  Shilimova,Alexander Varnavin-Braun,Katja Weimer]
- Back-end developers: [Alisa Tongaliuk,Taras Chaikovskyi,Denys Kovalenko]
- QA engineer: [Anastasiia Hryhorenko , Akmoor Zabytakhunova]  

For questions about testing the project or detecting bugs, please contact us by email: shilimova.a@gmail.com









   




