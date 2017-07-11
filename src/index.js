const horsey = require('horsey'); // Auto-complete
const Fuse = require('fuse.js'); // Better fuzzy search
const autoComplete = require('javascript-autocomplete'); // Trying another autocomplete


// const rootEl = document.querySelector('[data-ai-jobs-abc-root]');
// const appEl = document.createElement('div');

// appEl.className = 'ai-jobs-abc';
// appEl.innerHTML = '<pre>ai-jobs-abc OK!</pre>';
// rootEl.appendChild(appEl);

const classificationList = [
  { value: "111", text: "Chief Executives, General Managers and Legislators"},
  { value: "121", text: "Farmers and Farm Managers"},
  { value: "131", text: "Advertising, Public Relations and Sales Managers"},
  { value: "132", text: "Business Administration Managers"},
  { value: "133", text: "Construction, Distribution and Production Managers"},
  { value: "134", text: "Education, Health and Welfare Services Managers"},
  { value: "135", text: "ICT Managers"},
  { value: "139", text: "Miscellaneous Specialist Managers"},
  { value: "141", text: "Accommodation and Hospitality Managers"},
  { value: "142", text: "Retail Managers"},
  { value: "149", text: "Miscellaneous Hospitality, Retail and Service Managers"},
  { value: "211", text: "Arts Professionals"},
  { value: "212", text: "Media Professionals"},
  { value: "221", text: "Accountants, Auditors and Company Secretaries"},
  { value: "222", text: "Financial Brokers and Dealers, and Investment Advisers"},
  { value: "223", text: "Human Resource and Training Professionals"},
  { value: "224", text: "Information and Organisation Professionals"},
  { value: "225", text: "Sales, Marketing and Public Relations Professionals"},
  { value: "231", text: "Air and Marine Transport Professionals"},
  { value: "232", text: "Architects, Designers, Planners and Surveyors"},
  { value: "233", text: "Engineering Professionals"},
  { value: "234", text: "Natural and Physical Science Professionals"},
  { value: "241", text: "School Teachers"},
  { value: "242", text: "Tertiary Education Teachers"},
  { value: "249", text: "Miscellaneous Education Professionals"},
  { value: "251", text: "Health Diagnostic and Promotion Professionals"},
  { value: "252", text: "Health Therapy Professionals"},
  { value: "253", text: "Medical Practitioners"},
  { value: "254", text: "Midwifery and Nursing Professionals"},
  { value: "261", text: "Business and Systems Analysts, and Programmers"},
  { value: "262", text: "Database and Systems Administrators, and ICT Security Specialists"},
  { value: "263", text: "ICT Network and Support Professionals"},
  { value: "271", text: "Legal Professionals"},
  { value: "272", text: "Social and Welfare Professionals"},
  { value: "311", text: "Agricultural, Medical and Science Technicians"},
  { value: "312", text: "Building and Engineering Technicians"},
  { value: "313", text: "ICT and Telecommunications Technicians"},
  { value: "321", text: "Automotive Electricians and Mechanics"},
  { value: "322", text: "Fabrication Engineering Trades Workers"},
  { value: "323", text: "Mechanical Engineering Trades Workers"},
  { value: "324", text: "Panelbeaters, and Vehicle Body Builders, Trimmers and Painters"},
  { value: "331", text: "Bricklayers, and Carpenters and Joiners"},
  { value: "332", text: "Floor Finishers and Painting Trades Workers"},
  { value: "333", text: "Glaziers, Plasterers and Tilers"},
  { value: "334", text: "Plumbers"},
  { value: "341", text: "Electricians"},
  { value: "342", text: "Electronics and Telecommunications Trades Workers"},
  { value: "351", text: "Food Trades Workers"},
  { value: "361", text: "Animal Attendants and Trainers, and Shearers"},
  { value: "362", text: "Horticultural Trades Workers"},
  { value: "391", text: "Hairdressers"},
  { value: "392", text: "Printing Trades Workers"},
  { value: "393", text: "Textile, Clothing and Footwear Trades Workers"},
  { value: "394", text: "Wood Trades Workers"},
  { value: "399", text: "Miscellaneous Technicians and Trades Workers"},
  { value: "411", text: "Health and Welfare Support Workers"},
  { value: "421", text: "Child Carers"},
  { value: "422", text: "Education Aides"},
  { value: "423", text: "Personal Carers and Assistants"},
  { value: "431", text: "Hospitality Workers"},
  { value: "441", text: "Defence Force Members, Fire Fighters and Police"},
  { value: "442", text: "Prison and Security Officers"},
  { value: "451", text: "Personal Service and Travel Workers"},
  { value: "452", text: "Sports and Fitness Workers"},
  { value: "511", text: "Contract, Program and Project Administrators"},
  { value: "512", text: "Office and Practice Managers"},
  { value: "521", text: "Personal Assistants and Secretaries"},
  { value: "531", text: "General Clerks"},
  { value: "532", text: "Keyboard Operators"},
  { value: "541", text: "Call or Contact Centre Information Clerks"},
  { value: "542", text: "Receptionists"},
  { value: "551", text: "Accounting Clerks and Bookkeepers"},
  { value: "552", text: "Financial and Insurance Clerks"},
  { value: "561", text: "Clerical and Office Support Workers"},
  { value: "591", text: "Logistics Clerks"},
  { value: "599", text: "Miscellaneous Clerical and Administrative Workers"},
  { value: "611", text: "Insurance Agents and Sales Representatives"},
  { value: "612", text: "Real Estate Sales Agents"},
  { value: "621", text: "Sales Assistants and Salespersons"},
  { value: "631", text: "Checkout Operators and Office Cashiers"},
  { value: "639", text: "Miscellaneous Sales Support Workers"},
  { value: "711", text: "Machine Operators"},
  { value: "712", text: "Stationary Plant Operators"},
  { value: "721", text: "Mobile Plant Operators"},
  { value: "731", text: "Automobile, Bus and Rail Drivers"},
  { value: "732", text: "Delivery Drivers"},
  { value: "733", text: "Truck Drivers"},
  { value: "741", text: "Storepersons"},
  { value: "811", text: "Cleaners and Laundry Workers"},
  { value: "821", text: "Construction and Mining Labourers"},
  { value: "831", text: "Food Process Workers"},
  { value: "832", text: "Packers and Product Assemblers"},
  { value: "839", text: "Miscellaneous Factory Process Workers"},
  { value: "841", text: "Farm, Forestry and Garden Workers"},
  { value: "851", text: "Food Preparation Assistants"},
  { value: "891", text: "Freight Handlers and Shelf Fillers"},
  { value: "899", text: "Miscellaneous Labourers"}
];

var options = {
  shouldSort: true,
  keys: ['value', 'text'],
  threshold: 0.6,
  location: 0,
  distance: 100,
};

const fuse = new Fuse(classificationList, options);
const fuseResult = fuse.search('query');

const complete = new autoComplete({
  selector: '#job-classification',
  minChars: 2,
  source: function(term, suggest){
      term = term.toLowerCase();
      var choices = [
        "Chief Executives, General Managers and Legislators",
        "Farmers and Farm Managers",
        "Advertising, Public Relations and Sales Managers",
        "Business Administration Managers",
        "Construction, Distribution and Production Managers",
        "Education, Health and Welfare Services Managers",
        "ICT Managers",
        "Miscellaneous Specialist Managers",
        "Accommodation and Hospitality Managers",
        "Retail Managers",
        "Miscellaneous Hospitality, Retail and Service Managers",
        "Arts Professionals",
        "Media Professionals",
        "Accountants, Auditors and Company Secretaries",
        "Financial Brokers and Dealers, and Investment Advisers",
        "Human Resource and Training Professionals",
        "Information and Organisation Professionals",
        "Sales, Marketing and Public Relations Professionals",
        "Air and Marine Transport Professionals",
        "Architects, Designers, Planners and Surveyors",
        "Engineering Professionals",
        "Natural and Physical Science Professionals",
        "School Teachers",
        "Tertiary Education Teachers",
        "Miscellaneous Education Professionals",
        "Health Diagnostic and Promotion Professionals",
        "Health Therapy Professionals",
        "Medical Practitioners",
        "Midwifery and Nursing Professionals",
        "Business and Systems Analysts, and Programmers",
        "Database and Systems Administrators, and ICT Security Specialists",
        "ICT Network and Support Professionals",
        "Legal Professionals",
        "Social and Welfare Professionals",
        "Agricultural, Medical and Science Technicians",
        "Building and Engineering Technicians",
        "ICT and Telecommunications Technicians",
        "Automotive Electricians and Mechanics",
        "Fabrication Engineering Trades Workers",
        "Mechanical Engineering Trades Workers",
        "Panelbeaters, and Vehicle Body Builders, Trimmers and Painters",
        "Bricklayers, and Carpenters and Joiners",
        "Floor Finishers and Painting Trades Workers",
        "Glaziers, Plasterers and Tilers",
        "Plumbers",
        "Electricians",
        "Electronics and Telecommunications Trades Workers",
        "Food Trades Workers",
        "Animal Attendants and Trainers, and Shearers",
        "Horticultural Trades Workers",
        "Hairdressers",
        "Printing Trades Workers",
        "Textile, Clothing and Footwear Trades Workers",
        "Wood Trades Workers",
        "Miscellaneous Technicians and Trades Workers",
        "Health and Welfare Support Workers",
        "Child Carers",
        "Education Aides",
        "Personal Carers and Assistants",
        "Hospitality Workers",
        "Defence Force Members, Fire Fighters and Police",
        "Prison and Security Officers",
        "Personal Service and Travel Workers",
        "Sports and Fitness Workers",
        "Contract, Program and Project Administrators",
        "Office and Practice Managers",
        "Personal Assistants and Secretaries",
        "General Clerks",
        "Keyboard Operators",
        "Call or Contact Centre Information Clerks",
        "Receptionists",
        "Accounting Clerks and Bookkeepers",
        "Financial and Insurance Clerks",
        "Clerical and Office Support Workers",
        "Logistics Clerks",
        "Miscellaneous Clerical and Administrative Workers",
        "Insurance Agents and Sales Representatives",
        "Real Estate Sales Agents",
        "Sales Assistants and Salespersons",
        "Checkout Operators and Office Cashiers",
        "Miscellaneous Sales Support Workers",
        "Machine Operators",
        "Stationary Plant Operators",
        "Mobile Plant Operators",
        "Automobile, Bus and Rail Drivers",
        "Delivery Drivers",
        "Truck Drivers",
        "Storepersons",
        "Cleaners and Laundry Workers",
        "Construction and Mining Labourers",
        "Food Process Workers",
        "Packers and Product Assemblers",
        "Miscellaneous Factory Process Workers",
        "Farm, Forestry and Garden Workers",
        "Food Preparation Assistants",
        "Freight Handlers and Shelf Fillers",
        "Miscellaneous Labourers"
      ];
      
      const fuseResult = fuse.search(term);

      const fuseMatches = [];
      for (let i = 0; i < fuseResult.length; i++) {
        fuseMatches.push(fuseResult[i].text);
      }

      const matches = [];

      for (let i=0; i<choices.length; i++) {
        if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
      }
      console.log(fuseMatches);

      suggest(fuseMatches);
  }
});

// Horsey does not highlight Uppercase letters so let's convert to lowercase
const classificationListLower = [];
for (var i = 0; i < classificationList.length; i++) {
    classificationListLower[i] = 
      {
        value: classificationList[i].value,
        text: classificationList[i].text.toLowerCase()
      };
}

// horsey(document.querySelector('#job-classification'), {
//   source: [{
//     // id: "Job classification",
//     list: classificationListLower
//   }],
//   getText: 'text',
//   getValue: 'value',
//   filter: (query, selection) => {
//     console.log(this.source);
//     return true;
//   },
//   // noMatches: "Not found, try again",
//   // limit: 6
// });