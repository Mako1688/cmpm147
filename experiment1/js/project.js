// project.js - purpose and description here
// Author: Marco Ogaz-Vega
// Date: 4/4/24

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
    const fillers = {
      artistPre: ["Ariana", "Drake", "Sir", "Killers of", "Lil", "Henry", "Tomald", "Action", "Athletic", "Cumulous", "Kendrick", "DJ", "The", "Suprise", "King", "Queen", "Thievery", "Lord", "Lyrical", "21", "Doobey", "Brother", "Sister", "Father", "Mother", "Tankin", "Ringleader", "Corporate Program Associate"],
      artistPost: ["Grande", "Tom", "Jeff", "Drake", "Glizzard", "Gerald", "Poopin", "Scoopin", "Collective", "Conglomarate", "Hologram", "Party", "Jenky", "Future", "Soul", "Lemonade", "Mischief", "Boy", "Lad", "Chap", "Cat", "Dog", "Kaboom", "Freedom", "Crack", "Pain", "Derek", "Gus"],
      albumPre: ["The Second Coming of", "Real", "World of","Daft", "Afro", "Twin", "Who Is", "Ready For", "Unforgetable", "The Last", "Vampire", "Never", "New", "Home for the", "No More Crying, Now I'm", "This Is The Last Time I'm", "The World Wants", "Beastial", "In The Aeroplane Over The", "Run The"],
      albumPost: ["Dogs", "Cats", "Crying", "Blues", "Drugs", "Cannabilism", "3rd Degree Burns", "Hero", "Safari", "Harping", "Last Moments", "Dying Light", "Tekken Match", "Pleasures", "Play", "Girl", "Boy", "Attack", "Washing Machine", "Meltdown", "Bathroom Politics", "TRON"],
      genre: ["Post-Punk", "Hip-Hop", "Shoe Gaze", "Progressive Rock", "Smooth Jazz", "Country Blues", "Disco", "EDM", "Afro-Beats", "Pop", "Folk", "Latin", "Classical", "Death Metal", "R&B", "House"],
      num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of", "about twenty", "3x10^953"],
      country: ["The United States of America", "Eritrea", "The United Kingdom", "Senegal", "Their Mom's Basement", "a college frat house", "Mexico", "Italy", "Greece", "Spain", "Space", "Costa Rica", "Puerto Rico", "Argentina", "The Netherlands", "France", "the middle of the woods"],
      
    };
    
    const template = `$artistPre $artistPost has just dropped their newest album! 
    $albumPre $albumPost is set to be the best $genre release this year!
    Hailing from $country, their work has already impacted $num people!
    `;
    
    
    // STUDENTS: You don't need to edit code below this line.
    
    const slotPattern = /\$(\w+)/;
    
    function replacer(match, name) {
      let options = fillers[name];
      if (options) {
        return options[Math.floor(Math.random() * options.length)];
      } else {
        return `<UNKNOWN:${name}>`;
      }
    }
    
    function generate() {
      let story = template;
      while (story.match(slotPattern)) {
        story = story.replace(slotPattern, replacer);
      }
    
      /* global box */
      $("#box").text(story);
    }
    
    /* global clicker */
    $("#clicker").click(generate);
    
    generate();
    
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
}

// let's get this party started - uncomment me
main();