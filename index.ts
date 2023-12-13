import { Elysia } from 'elysia';
import * as mongoose from 'mongoose';
import { html } from '@elysiajs/html';
import { Products } from './product.ts';
import { Warehouse } from './warehouse.ts';
import { Picker } from './picker.ts';
import { Chauffeur } from './chauffeur.ts';
import { LogisticsSystemConfig } from './logisticsSystemConfig.ts';
import { Order } from './order.ts';

// Create server
const server = new Elysia();
server.use(html());

// Name lists
let namesMale = ["Åke", "Ögge", "Önde", "Öne", "Önne", "Örjan", "Övid", "Adam", "Adrian", "Albert", "Albin", "Alex", "Alexander", "Alf", "Alfred", "Allan", "Alvin", "Anders", "André", "Andreas", "Anton", "Arendt", "Arfast", "Arne", "Arnfast", "Aron", "Arvid", "Astrad", "August", "Axel", "Börje", "Bengt", "Benjamin", "Bertil", "Birger", "Björn", "Bo", "Bror", "Calle", "Carl", "Casper", "Charles", "Christer", "Christian", "Daniel", "David", "Ebbe", "Eddie", "Edgar", "Edvard", "Edvin", "Edward", "Einar", "Elias", "Elis", "Elliot", "Elton", "Elvin", "Emanuel", "Emil", "Emmanuel", "Erengisle", "Eric", "Erik", "Ernst", "Evert", "Faje", "Fardhe", "Farman", "Felix", "Filip", "Fingal", "Folke", "Frank", "Fredrik", "Gärdar", "Göran", "Gösta", "Gabriel", "Georg", "Gertorn", "Gjöl", "Gjohl", "Gjur", "Gorm", "Gudhlek", "Gunnar", "Gustaf", "Gustav", "Håkan", "Hampus", "Hannes", "Hans", "Harald", "Harry", "Henrik", "Henry", "Herse", "Hersten", "Hindrik", "Hjalmar", "Holvaster", "Hugo", "Ingemar", "Ingmar", "Ingvar", "Isac", "Isak", "Ivar", "Jack", "Jacob", "Jan", "Jens", "Joacim", "Joakim", "Joar", "Joel", "Joen", "Johan", "Johannes", "John", "Johnny", "Jonas", "Jonathan", "Jonny", "Josef", "Julian", "Julius", "Kalle", "Karl", "Kent", "Kevin", "Kjell", "Knut", "Krister", "Kurt", "Lars", "Leif", "Lennart", "Leo", "Leon", "Leonard", "Liam", "Linus", "Loke", "Love", "Lucas", "Ludvig", "Lukas", "Magnus", "Malte", "Marcus", "Martin", "Mats", "Matteo", "Mattias", "Max", "Maximilian", "Melker", "Melvin", "Michael", "Mikael", "Natanael", "Nataniel", "Nicholas", "Nicklas", "Niklas", "Nils", "Noah", "Odert", "Oliver", "Olle", "Olof", "Olov", "Ored", "Orvar", "Oscar", "Oskar", "Otto", "Ove", "Patrick", "Patrik", "Per", "Peter", "Philip", "Ragnar", "Rasmus", "Ravel", "Richard", "Rikard", "Robert", "Roger", "Roland", "Rolf", "Rune", "Sackarias", "Sakarias", "Sam", "Samuel", "Sebastian", "Segol", "Sigge", "Simon", "Sixten", "Sone", "Spjälle", "Stefan", "Sten", "Stig", "Sture", "Svante", "Sven", "Sverker", "Tage", "Theo", "Theodor", "Thomas", "Tim", "Tobias", "Tomas", "Tommy", "Tor", "Tore", "Torsten", "Tron", "Tyres", "Ulf", "Valdemar", "Valentin", "Valter", "Velam", "Vensel", "Vernik", "Vidar", "Viggo", "Viktor", "Vilgot", "Vilhelm", "Ville", "Vincent", "Vollrat", "Wilhelm", "William", "Wilmer", "Zacharias", "Zakarias"];
let namesFemale = ["Adele", "Adelheid", "Adelina", "Adeline", "Adhelin", "Agnes", "Agneta", "Aimée", "Alexandra", "Alice", "Alicia", "Alina", "Alma", "Alva", "Amanda", "Andrea", "Anette", "Angela", "Angelina", "Anita", "Anja", "Ann", "Ann-Louise", "Ann-Sofie", "Anna", "Anna-Lena", "Anne", "Annika", "Asgärd", "Astrid", "Barbro", "Bea", "Beata", "Beatrice", "Bella", "Berit", "Bianca", "Birgit", "Birgitta", "Britt", "Britt-Louise", "Britt-Marie", "Britta", "Camilla", "Carina", "Caroline", "Catarina", "Cecilia", "Charlotta", "Charlotte", "Christin", "Christina", "Christine", "Clara", "Cornelia", "Daniela", "Daniella", "Denice", "Denise", "Ebba", "Edit", "Edith", "Eleonora", "Elin", "Elina", "Elisabet", "Elisabeth", "Elise", "Eljena", "Ella", "Ellen", "Ellena", "Ellie", "Elsa", "Else", "Else-Maj", "Elsi", "Elvira", "Emeli", "Emelie", "Emely", "Emilia", "Emilie", "Emma", "Emmelie", "Emmely", "Emmy", "Erica", "Erika", "Ester", "Esther", "Eva", "Eva-Stina", "Evelina", "Fanny", "Felicia", "Fia", "Filippa", "Fiona", "Fransiska", "Freja", "Freya", "Frida", "Gabriella", "Gillian", "Greta", "Gun", "Gun-Britt", "Gunborg", "Gunbritt", "Gunhild", "Gunilla", "Gunvor", "Gyrid", "Hanna", "Hebbla", "Hedda", "Hedvig", "Heidi", "Helen", "Helena", "Hellen", "Hilda", "Hildr", "Ida", "Ines", "Inga", "Ingeborg", "Ingegärd", "Ingegerd", "Inger", "Ingiärd", "Ingrid", "Irene", "Iris", "Irma", "Isabella", "Isabelle", "Jackie", "Janina", "Jasmine", "Jennifer", "Jenny", "Jesca", "Joanna", "Johanna", "Jonna", "Josefin", "Josefina", "Josefine", "Josephine", "Julia", "Julie", "Juliette", "June", "Karin", "Karolina", "Katarina", "Katharina", "Katja", "Katri", "Kerstin", "Kira", "Klara", "Kristin", "Kristina", "Leila", "Lena", "Leona", "Leonora", "Lilian", "Lina", "Linda", "Linnéa", "Linn", "Linnea", "Lisa", "Lisette", "Liv", "Lizette", "Locis", "Louisa", "Louise", "Lovisa", "Lucia", "Lykke", "Märta", "Madeleine", "Madelene", "Maj", "Maj-Britt", "Maj-Gun", "Maja", "Majken", "Malin", "Margareta", "Margit", "Maria", "Marie", "Marie-Louise", "Marie-Sofie", "Mathilde", "Matilda", "Meja", "Melina", "Melissa", "Mia", "Michaela", "Michelle", "Mikaela", "Milla", "Millan", "Millie", "Milly", "Mimmi", "Minna", "Mira", "Mirabella", "Miranda", "Miriam", "Mirjam", "Miryam", "Moa", "Molly", "Monica", "My", "Nadia", "Nadja", "Nathalie", "Nea", "Nellie", "Nelly", "Nichole", "Nicholina", "Nicole", "Nicolina", "Nikita", "Nora", "Oleana", "Olivia", "Ottilia", "Patricia", "Pernilla", "Petronella", "Pia", "Ragiähl", "Ragierdh", "Ragnil", "Rebecca", "Rebecka", "Ronja", "Rosemarie", "Rut", "Saga", "Sally", "Samanta", "Samantha", "Sandra", "Sanna", "Sara", "Selma", "Signe", "Sigrid", "Simona", "Simone", "Siri", "Siv", "Smilla", "Sofia", "Sofie", "Sonja", "Stella", "Stina", "Susanne", "Svea", "Thea", "Therese", "Tilda", "Tilde", "Tindra", "Tone", "Tove", "Tullia", "Tuva", "Tyra", "Ulla", "Ulrika", "Vera", "Veronica", "Veronika", "Victoria", "Viktoria", "Vilda", "Vilhelmina", "Vilma", "Viola", "Viveka", "Viviana", "Vivianne", "Wilhelmina", "Wilma", "Yvonne"];
let names2 = ["Åberg", "Ågren", "Åkerlund", "Öberg", "Östberg", "Östlund", "Aalberg", "Aberg", "Adelsköld", "Afzelius", "Ahlander", "Ahlgren", "Ahlund", "Akerman", "Akerström", "Almgren", "Almqvist", "Anderberg", "Anderson", "Angström", "Antonsson", "Aspelund", "Asplund", "Augustsson", "Axelsson", "Backström", "Bengtsson", "Berggren", "Bergh", "Bergius", "Bergkvist", "Berglund", "Bergman", "Bergmann", "Bergquist", "Bergqvist", "Bergström", "Björk", "Bjorklund", "Bjorkman", "Blix", "Bloch", "Blom", "Blomgren", "Blomquist", "Blomqvist", "Blomstedt", "Bolander", "Borg", "Borgström", "Brahe", "Brodd", "Bruun", "Byström", "Carlsson", "Ceder", "Cederblom", "Cederström", "Crusenstolpe", "Dahl", "Dahlberg", "Dahlgren", "Dahlin", "Dahlman", "Dahlquist", "Dahlström", "Dalin", "Davidsson", "Degermark", "Dilara", "Drakenberg", "Edgren", "Edlund", "Edström", "Egnell", "Ekberg", "Ekblad", "Ekbom", "Ekdahl", "Ekdal", "Ekholm", "Eklund", "Ekman", "Ekström", "Engberg", "Engdahl", "Englund", "Engström", "Enquist", "Ericsson", "Eriksson", "Ernman", "Fältskog", "Fagerudd", "Fornberg", "Forsberg", "Forslund", "Forsman", "Fredholm", "Friberg", "Frisk", "Göransson", "Geijer", "Grönberg", "Grönblom", "Granqvist", "Gunnarsson", "Gustafson", "Gyllenhaal", "Gylling", "Hägg", "Hägglund", "Hagelin", "Hagerström", "Haglund", "Hagström", "Hallström", "Hammarberg", "Hammarström", "Hansdotter", "Hansson", "Hedberg", "Hedlund", "Hedman", "Hedström", "Heidenstam", "Hellberg", "Hellquist", "Hellqvist", "Henriksson", "Hermansson", "Hjertsson", "Hjortsberg", "Holgersson", "Holm", "Holmgren", "Holmlund", "Holmquist", "Holmqvist", "Holmström", "Hopp", "Hultgren", "Isaksson", "Järnefelt", "Jönsson", "Jacobsson", "Jakobsson", "Jansson", "Johannesson", "Johansson", "Johnsson", "Jonsson", "Källström", "Karlsson", "Kroon", "Löfgren", "Lötvall", "Lagerfeld", "Lagerfelt", "Lagerkvist", "Lagerlöf", "Lagerquist", "Lagerqvist", "Larsson", "Laxman", "Lennartsson", "Liljeström", "Lindén", "Lind", "Lindahl", "Lindbergh", "Lindblad", "Lindblom", "Lindelöf", "Lindeman", "Linderoth", "Lindgren", "Lindholm", "Lindquist", "Lindqvist", "Lindroth", "Lindskog", "Lindström", "Ljung", "Ljungberg", "Lund", "Lundberg", "Lundell", "Lundgren", "Lundholm", "Lundin", "Lundmark", "Lundquist", "Lundström", "Mörner", "Magnuson", "Magnusson", "Malmberg", "Malmgren", "Malmkvist", "Malmquist", "Malmqvist", "Malmsten", "Malmström", "Marklund", "Mattisson", "Mattson", "Molander", "Moller", "Naslund", "Nilsson", "Norberg", "Norddahl", "Nordin", "Nordlund", "Nordquist", "Nordström", "Norström", "Nyström", "Odenberg", "Odhner", "Ohlin", "Ohlson", "Ohlsson", "Ohly", "Olander", "Olofsson", "Olsson", "Ossler", "Oström", "Palmcrantz", "Palme", "Palmgren", "Palmstruch", "Paulsson", "Persson", "Petersson", "Pettersson", "Posse", "Quist", "Qvist", "Rehn", "Rehnquist", "Richardsson", "Rosenblad", "Rosenquist", "Rosenqvist", "Söderberg", "Södergren", "Söderholm", "Söderlund", "Sörenstam", "Samuelsson", "Sandberg", "Sanddahl", "Sandell", "Sandin", "Sandström", "Schauman", "Selander", "Simonsson", "Sjöberg", "Sjögren", "Sjöholm", "Sjöström", "Sköld", "Skarsgård", "Skoglund", "Skoog", "Sohlmann", "Sparre", "Sparv", "Stenbeck", "Stenbock", "Stenmark", "Stenström", "Ström", "Strömberg", "Strandberg", "Sundberg", "Sundin", "Sundqvist", "Sundström", "Svärd", "Svensson", "Syrén", "Tegnér", "Tornquist", "Torvalds", "Ulf", "Vikström", "Wahlberg", "Wahlgren", "Wahlström", "Wallenberg", "Wallin", "Westergren", "Westermarck", "Westermark", "Widforss", "Wikström", "Winblad"];
let productNames1 = ["Ape", "Armadillo", "Baboon", "Badger", "Bat", "Bear", "Beaver", "Bird of Paradise", "Boar", "Bobcat", "Bugbear", "Bunyip", "Cat", "Chicken", "Cobra", "Cockatoo", "Cougar", "Coyote", "Crane", "Crow", "Cuckoo", "Deer", "Dodo", "Dog", "Dove", "Dragonling", "Drake", "Eagle", "Falcon", "Ferret", "Finch", "Fox", "Golem", "Frog", "Gerbil", "Goat", "Goldhorn", "Goose", "Gorilla", "Gull", "Hamster", "Hare", "Hawk", "Hedgehog", "Heron", "Hound", "Hummingbird", "Hyena", "Ibex", "Jackal", "Jackalope", "Jaguar", "Kangaroo", "Kingfisher", "Kitsune", "Kiwi", "Koala", "Komodo Dragon", "Lemur", "Lion", "Llama", "Lovebird", "Lynx", "Macaw", "Magpie", "Mandrill", "Manticore", "Meerkat", "Mongoose", "Mouse", "Newt", "Nightingale", "Ocelot", "Opposum", "Otter", "Owl", "Panda", "Panther", "Parakeet", "Parrot", "Peacock", "Penguin", "Pheasant", "Phoenix", "Pig", "Pigeon", "Quail", "Rabbit", "Raccoon", "Rat", "Raven", "Red Panda", "Roc", "Sloth", "Snake", "Spider", "Squirrel", "Stork", "Tarsier", "Thunderbird", "Toad", "Tortoise", "Turkey", "Turtle", "Vulture", "Weasel", "Wolf", "Wolpertinger", "Wolverine", "Wombat", "Woodpecker", "Yak"];
let warehouseNames1 = ["Dragonspire", "Redmont", "Farrador", "Dannamore", "Windamere", "Braewood", "Perrigwyn", "Cantlyn", "Tessaway", "Brawnlyn", "Aeskrow", "Balling", "Boltan", "Boltangate", "Caestshire", "Celnaer", "Slyborn", "Calbridge", "Dewmire", "Craester Arms", "Croglang", "Darton", "Darenby", "Dunstead", "Shardore", "Goodmond", "Salkire", "Hordrigg", "Hopeshire", "Haerton", "Cullin", "Murton", "Iredale", "Cornby", "Croilton", "Kirkoswald", "Levans", "Little Cardle", "Carderby", "Ormshire", "Dockerly", "Pierceton", "Crandalholme", "Faerchester", "Sella", "Skelside", "Selsmire", "Staerdale", "Direwood", "Waernell", "Worthwood", "Wilton", "Bellbroke", "Brivey", "Breuce", "Ashington", "Haword", "Clifton", "Highcalere", "Mireworth", "New Wandour", "Bornesher", "Werth", "Wishborne", "Arcton", "Allerton", "Auglire", "Avolire", "Bellton", "Bilesworth", "Bode", "Aedon", "Garring", "Baedcove", "Crireton", "Cloveshire", "Custaeton", "Crachton", "Droskyn", "Elkmire", "Ernmore", "Uwile", "Farleigh", "Harley", "Werthingham", "Zatherop", "Blire", "Pradingly", "Highburn", "Hillfield", "Kernwith", "Cowle", "Knaerwood", "Nascombe", "Midford", "Malgrave", "Otterberg", "Kentillie", "Reave", "Ryre", "St. Clare", "Sipdon", "Seanton", "Santhope", "Dudley", "Swanton", "Streganna", "Wardhurst", "Whitehaven", "Wattingham", "Whitstone", "Wallersley", "Willbridge", "Appley", "Baldon", "Blaise", "Bolltree", "Baston", "Bryalshire", "Broadcove", "Castlebourne", "Clarn", "Clapton", "Dinton", "Draydon", "Darnstall", "Dustorn", "Portam", "Headow", "Garley", "Naesbrey", "Parton", "Redford", "Yardway", "Weavington", "Cladborough", "Parthley", "Rundhey", "Bargsea", "Sevenberg", "Shaldorn", "Starm", "Saelmere", "Nightwell", "Starnborough", "Stowe", "Strathenberg", "Sandorne", "Wardford", "Bangleswade", "Baltso", "Cainhorn", "Chilgrave", "Eastcairn", "Galbury", "Flatwick", "Hingham", "Cardell", "Cordington", "Ranhold", "Rissingshire", "Khurleigh", "Talsworth", "Tarlington", "Cottenhorn", "Yielden", "Sangeries", "Barthmont", "Dewbury", "Hampstead", "Yorthendon", "Darlington", "Windsor", "Calber", "Pardwell", "Cunningham", "Laventhorpe", "Cublerton", "Broadborough", "Eallesborough", "Arvendon", "Karmble", "Marseden", "Tarville", "Wolveshire", "Coarshire", "Alderth", "Borun", "Hurwell", "Lambridge", "Charvaley", "Earlton", "Ely", "Hartington", "Carsley", "Catterborough", "Warltonwood", "Larton", "Elden", "Cambolton", "Mortling", "Fanthorpe", "Farnborough", "Croftvalley", "Eldford", "Dandlestone", "Faerdham", "Gourdley", "Merclefield", "Goulpass", "Craentich", "Norhall", "Whitich", "Paelford", "Corlach", "Adwick", "Sparrington", "Baerston", "Chastershire", "Chourmondeley", "Dordington", "Hurlton", "Parkforton", "Coltherstone", "Calden", "Cadworth", "Startlam", "Aeckland", "Bawres", "Barnacton", "Darham", "Lorton", "Faemley", "Mortham", "Scarwood", "Wulworth", "Witton", "Boussiney", "Borthrough", "Curdingham", "Harlston", "Arpton", "Pernstow", "Caerhayes", "Curnbrey", "Faerseton", "Parandor", "Fangdor", "Eastormel", "Artanges", "Termarth", "Oldingham", "Howers", "Aegremonth", "Haeresceugh", "Haertley", "Ayes", "Carcoswald", "Lamberside", "Lardel", "Merryport", "Perlington", "Staedbergh", "Tortmain", "Ardleby", "Armathain", "Earnside", "Easkerton", "Bartham", "Barncowl", "Barkenburgh", "Brackhill", "Barthwaite", "Bourgh", "Borugham", "Burneside", "Carlisle", "Gatterlen", "Clafton", "Ackermouth", "Carby", "Bacre", "Hartlon", "Warington", "Darwaeton", "Darrumburgh", "Harbyborough", "Hayton", "Harzelslack", "Hewgill", "Haarton", "Aysel", "Kaerndal", "Karthmere", "Carnstock", "Fowther", "Middleborough", "Gancaster", "Naeworth", "Newbining", "Pendragon", "Enrilth", "Rose", "Scatterby", "Mizeareigh", "Torpin", "Aebarrow", "Withall", "Arltington", "Wray", "Yeanworth", "Lakewell", "Darbey", "Daffield", "Galsop", "Garsley", "Heathersage", "Helmesfield", "Oakenfield", "Haersley", "Calbourne", "Mearley", "Palsbury", "Bellsover", "Candor", "Elverston", "Headdon", "Merkworth", "Parverhill", "Raebershire", "Wringcaster", "Harmpton", "Bernstaple", "Darpley", "Blackdown", "Eagleview", "Harwood", "Oakwell", "Millford", "Tarsington", "Caenleigh", "Eaveton", "Pomparley", "Backleigh", "Dawnton", "Darthill", "Dorgoil", "Gadleigh", "Heamyock", "Kingshill", "Leydford", "Merliscire", "Oakhampton", "Plympford", "Sraederham", "Rouguemont", "Talverton", "Waelcombe", "Taetnire", "Moldermouth", "Lorechester", "Callborough", "Marshwood", "Elderstock", "Riverfoot", "Starminster", "Waerham", "Bellesea", "Corftey", "Raefus", "Woodsford", "Eaghton", "Heathyard", "Yanborough", "Darfield", "Maetrine", "Warsle", "Perlsea", "Glottenham", "Islefield", "Bordium", "Herstings", "Laeves", "Pevanshire", "Rye", "Capvering", "Cainfield", "Angarth", "Baerth", "Pelsley", "Carleigh", "Calchester", "Cadleigh", "Hardingham", "Waerlden", "Barmsfield", "Harle", "Sirenchester", "Barknor", "Howlester", "Fowlsfield", "Brittlebean", "Miserth", "Narlington", "Ruarden", "Carneath", "Greenhill", "Tarnton", "Wenchcombe", "Barkely", "Beverstone", "Barviel", "Stadely", "Tornbury", "Alterwood", "Starkport", "Rachdale", "Dornham", "Lanchester", "Backton", "Arlcliff", "Calsley", "Herst", "Nartley", "Ardiham", "Forechester", "Windshire", "Wolvesley", "Almerry", "Ashtanshire", "Barnsil", "Berdwardshire", "Dorston", "Ardismouth", "Barlishmire", "Eryas", "Haerford", "Kalepeck", "Langen", "Lyonhall", "Mercle", "Arcop", "Fernyard", "Stappleton", "Warcton", "Burmstone", "Barmpton", "Calford", "Croft", "Dawnton", "Goulrich", "Cannersly", "Permbridge", "Stonehill", "Wintershold", "Windkeep", "Archdale", "Treehold", "Summerswind", "Ultrona", "Langdale", "Longdale", "Bruckstone", "Euthoria", "Azgul", "Stormholme", "Riverdale", "Ulentor", "Mirador", "Bundor", "Gandum", "Mandoom", "Daroonga", "Grimtol", "Gumtar", "Muria", "Maelony", "Galadhor", "Gundor", "Logoria", "Taergoria", "Whitmore", "Warlton", "Arnstey", "Berlington", "Starford", "Parlton", "Tharfield", "Windmontley", "Barkhamsted", "East Lowes", "West Lowes", "Curlisbrooke", "Narris", "Yarlmouth", "Cormwell", "Minbury", "Brancheley", "Falkerstone", "Queensborough", "Stowerling", "Tharnham", "Earlington", "Calterburry", "Chirlingstone", "Charhelm", "Eynsworth", "Leyebourne", "Saltwood", "Raychester", "Sarsinghurst", "Tornbridge", "Alnor", "Waelmore"];
let warehouseNames2 = ["Castle", "Keep", "Hold", "Palace", "Fort", "Stronghold", "Citadel", "Fortress"];

// Number of milliseconds in an hour
const msPerHour = 3600 * 1000;
// Random integer between min and max
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);
// Current hour (Date.now() rounded down to the nearest hour)
const hourNow = () => Date.now() - (Date.now() % msPerHour);

// Generate chauffeurs
server.get('/workers/chauffeur/generate/:amount', async ({ params }) => {

    console.log("Generating chauffeurs...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextWorkerId = logisticsSystemConfig?.nextWorkerId || 0;

    // Generate chauffeurs
    for (let index = 0; index < parseInt(params.amount); index++) {

        // Generate random name
        let firstName = "";
        if (randInt(0, 1) == 0) {
            firstName = namesMale[randInt(0, namesMale.length)];
        }
        else {
            firstName = namesFemale[randInt(0, namesMale.length)];
        }
        let lastName = names2[randInt(0, names2.length)];

        // Status message
        console.log(`Creating chauffeur ${nextWorkerId} ${firstName} ${lastName}`);

        // Create chauffeur
        let chauffeur = new Chauffeur({
            name: `${firstName} ${lastName}`,
            workerId: nextWorkerId, schedule: []
        });

        // Populate schedule
        for (let j = 0; j < randInt(0, 20); j++) {
            // Start time
            let start = hourNow() + msPerHour * randInt(22, 28) * j;
            // End time
            let end = start + msPerHour * randInt(6, 8);

            chauffeur.schedule.push({
                start: new Date(start),
                end: new Date(end)
            });
        }

        // Save chauffeur
        try {
            await chauffeur.save()
                .then(() => console.log("Chauffeur saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment workerId
        nextWorkerId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextWorkerId = nextWorkerId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");
        // Create config
        try {
            await LogisticsSystemConfig.create({ nextWorkerId: nextWorkerId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all chauffeurs
    return await Chauffeur.find();
});

// Generate pickers
server.get('/workers/picker/generate/:amount', async ({ params }) => {

    console.log("Generating pickers...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextWorkerId = logisticsSystemConfig?.nextWorkerId || 0;

    // Generate pickers
    for (let index = 0; index < parseInt(params.amount); index++) {

        // Generate random name
        let firstName = "";
        if (randInt(0, 1) == 0) {
            firstName = namesMale[randInt(0, namesMale.length)];
        }
        else {
            firstName = namesFemale[randInt(0, namesMale.length)];
        }
        let lastName = names2[randInt(0, names2.length)];

        console.log(`Creating picker ${nextWorkerId} ${firstName} ${lastName}`);

        // Create picker
        let picker = new Picker({
            name: `${firstName} ${lastName}`,
            workerId: nextWorkerId,
            schedule: []
        });

        // Populate schedule
        for (let j = 0; j < randInt(0, 20); j++) {
            // Start time
            let start = hourNow() + msPerHour * randInt(22, 28);
            // End time
            let end = start + msPerHour * randInt(6, 8);
            // Warehouse
            let warehouse = randInt(0, ((logisticsSystemConfig?.nextWarehouseId || 1) - 1));

            picker.schedule.push({
                start: new Date(start),
                end: new Date(end),
                wareHouse: warehouse
            });
        }

        // Save picker
        try {
            picker.save().then(() => console.log("Picker saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment workerId
        nextWorkerId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextWorkerId = nextWorkerId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");
        // Create config
        try {
            await LogisticsSystemConfig.create({ nextWorkerId: nextWorkerId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all pickers
    return await Picker.find();
});

// Generate products
server.get('/products/generate', async () => {

    console.log("Generating products...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextProductId = logisticsSystemConfig?.nextProductId || 0;

    // Generate products
    for (let index = 0; index < productNames1.length; index++) {

        console.log(`Creating product ${nextProductId} ${productNames1[index]}`);

        // Create product
        try {
            await Products.create({
                name: `${productNames1[index]}`,
                productId: nextProductId,
                weight: randInt(0, 1000),
                price: randInt(100, 1000)
            })
                .then(() => console.log("Product saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment productId
        nextProductId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextProductId = nextProductId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");

        // Create config
        try {
            await LogisticsSystemConfig.create({ nextProductId: nextProductId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all products
    return await Products.find();
});

// Generate warehouses
server.get('/warehouses/generate/:amount', async ({ params }) => {

    console.log("Generating warehouses...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextWarehouseId = logisticsSystemConfig?.nextWarehouseId || 0;

    // Generate warehouses
    for (let index = 0; index < parseInt(params.amount); index++) {

        // Generate random name
        let firstName = warehouseNames1[randInt(0, warehouseNames1.length)];
        let lastName = warehouseNames2[randInt(0, warehouseNames2.length)];

        console.log(`Creating warehouse ${nextWarehouseId} ${firstName} ${lastName}`);

        // Create warehouse
        let warehouse = new Warehouse({
            name: `${firstName} ${lastName}`,
            warehouseId: nextWarehouseId,
            stock: []
        });

        // Populate stock
        for (let j = 0; j < randInt(0, productNames1.length); j++) {
            warehouse.stock.push({
                productId: randInt(0, (logisticsSystemConfig?.nextProductId || 1) - 1),
                shelf: j,
                quantity: randInt(0, 20)
            });
        }

        // Save warehouse
        try {
            await warehouse.save().then(() => console.log("Warehouse saved"));
        }
        catch (err) {
            console.log(err);
        }

        // Increment warehouseId
        nextWarehouseId++;
    }

    // Update config values
    if (logisticsSystemConfig != null) {
        logisticsSystemConfig.nextWarehouseId = nextWarehouseId;
        await logisticsSystemConfig.save();
    }
    else {
        console.log("LogisticsSystemConfig is null");
        // Create config
        try {
            await LogisticsSystemConfig.create({ nextWarehouseId: nextWarehouseId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all warehouses
    return await Warehouse.find();
});

// Generate orders
server.get('/orders/generate/:amount', async ({ params }) => {

    console.log("Generating orders...");

    // Load config values
    let logisticsSystemConfig = await LogisticsSystemConfig.findOne()
    let nextOrderId = logisticsSystemConfig?.nextOrderId || 0;

    // Generate orders
    for (let i = 0; i < parseInt(params.amount); i++) {

        console.log(`Creating order ${nextOrderId}`);

        // Create order
        let order = await Order.create({ orderId: nextOrderId });

        // Increment orderId
        nextOrderId++;

        // Generate products
        let listOfProducts = [];
        for (let j = 0; j < randInt(0, 10); j++) {
            listOfProducts.push({
                productId: randInt(0, ((logisticsSystemConfig?.nextProductId || 1) - 1)),
                quantity: randInt(1, 10)
            });
        }

        // Find where these products can be found
        let wareHouseSources = await pickFromWharehouses(listOfProducts);

        // If no warehouses can fulfill this order then log it and continue
        if (wareHouseSources == null) {
            console.log("order failed");
        }
        else {
            // Add the products of the first warehouse to the order
            wareHouseSources[0].demandsMet.forEach(element => {
                order.products.push({
                    productId: element.productId,
                    quantity: element.quantity
                });
            });

            // Mark the first warehouse as the warehouse of the order
            order.warehouseId = wareHouseSources[0].warehouseId;

            // If one warehouse wasn't enough to fill the order, create suborders
            if (wareHouseSources.length > 1) {

                // Iterate through the warehouses
                for (let j = 1; j < wareHouseSources.length; j++) {

                    // Create suborder
                    let subOrder = new Order({
                        orderId: nextOrderId,
                        warehouseId: wareHouseSources[j].warehouseId
                    });

                    // Mark the suborder on the main order
                    order.suborders.push(nextOrderId);

                    // Increment orderId
                    nextOrderId++;

                    // Add the products of the warehouse to the suborder
                    wareHouseSources[j].demandsMet.forEach(element => {
                        subOrder.products.push({
                            productId: element.productId,
                            quantity: element.quantity
                        });
                    });

                    // Add timestamps to the suborder
                    for (let k = 0; k < randInt(0, 5); k++) {

                        // Add timestamp
                        subOrder.status.push({
                            timeStamp: new Date(
                                Date.now()
                                - msPerHour * 4
                                + msPerHour * k
                                + randInt(0, msPerHour * 0.5)
                            )
                        });

                        // If the timestamp is picking
                        if (k == 1) {

                            // Find pickers that are available at this time at this warehouse
                            let possiblePickers = await Picker.find({
                                schedule: {
                                    $elemMatch: {
                                        start: { $lte: subOrder.status[k].timeStamp },
                                        end: { $gte: subOrder.status[k].timeStamp },
                                        wareHouse: subOrder.warehouseId
                                    }
                                }
                            });

                            // If there are pickers available assign one to the suborder
                            if (possiblePickers.length > 0) {
                                subOrder.status[k].WorkerId = possiblePickers[randInt(0, (possiblePickers.length - 1))].workerId;
                            }
                            else {
                                // else log it and remove the timestamp
                                console.log("No pickers available");
                                subOrder.status.pop()
                                break;
                            }
                        }

                        // If the timestamp is delivering
                        if (k == 3) {

                            // Find chauffeurs that are available at this time
                            let possibleChauffeurs = await Chauffeur.find({
                                schedule: {
                                    $elemMatch: {
                                        start: { $lte: subOrder.status[k].timeStamp },
                                        end: { $gte: subOrder.status[k].timeStamp }
                                    }
                                }
                            });

                            // If there are chauffeurs available assign one to the suborder
                            if (possibleChauffeurs.length > 0) {
                                subOrder.status[k].WorkerId = possibleChauffeurs[randInt(0, (possibleChauffeurs.length - 1))].workerId;
                            }
                            else {
                                // else log it and remove the timestamp
                                console.log("No chauffeurs available");
                                subOrder.status.pop()
                                break;
                            }
                        }
                    }

                    // Save suborder
                    await subOrder.save()
                        .then(() => console.log("Suborder saved"));
                }

                // If there are suborders only add a queued timestamp to the main order
                order.status.push({ timeStamp: new Date(Date.now()) });
            }
            else {
                // else (if there are no suborders)

                // Add timestamps
                for (let k = 0; k < Math.floor(Math.random() * 5); k++) {

                    // Add timestamp
                    order.status.push({
                        timeStamp: new Date(
                            Date.now()
                            - msPerHour * 4
                            + msPerHour * k
                            + randInt(0, msPerHour * 0.5)
                        )
                    });

                    // If the timestamp is picking
                    if (k == 1) {

                        // Find pickers that are available at this time at this warehouse
                        let possiblePickers = await Picker.find({
                            schedule: {
                                $elemMatch: {
                                    start: { $lte: order.status[k].timeStamp },
                                    end: { $gte: order.status[k].timeStamp },
                                    wareHouse: order.warehouseId
                                }
                            }
                        });

                        // If there are pickers available assign one to the order
                        if (possiblePickers.length > 0) {
                            order.status[k].WorkerId = possiblePickers[Math.floor(Math.random() * (possiblePickers.length - 1))].workerId;
                        }
                        else {
                            // else log it and remove the timestamp
                            console.log("No pickers available");
                            order.status.pop()
                            break;
                        }
                    }

                    // If the timestamp is delivering
                    if (k == 3) {

                        // Find chauffeurs that are available at this time
                        let possibleChauffeurs = await Chauffeur.find({
                            schedule: {
                                $elemMatch: {
                                    start: { $lte: order.status[k].timeStamp },
                                    end: { $gte: order.status[k].timeStamp }
                                }
                            }
                        });

                        // If there are chauffeurs available assign one to the order
                        if (possibleChauffeurs.length > 0) {
                            order.status[k].WorkerId = possibleChauffeurs[Math.floor(Math.random() * (possibleChauffeurs.length - 1))].workerId;
                        }
                        else {
                            // else log it and remove the timestamp
                            console.log("No chauffeurs available");
                            order.status.pop()
                            break;
                        }
                    }
                }
            }
        }

        // Save order
        await order.save().then(() => console.log("Order saved"));
    }

    // Update config values
    if (logisticsSystemConfig != null) {

        logisticsSystemConfig.nextOrderId = nextOrderId;

        await logisticsSystemConfig.save().then(() =>
            console.log("LogisticsSystemConfig saved"));

    }
    else {

        console.log("LogisticsSystemConfig is null");

        // Create config
        try {
            await LogisticsSystemConfig.create({ nextOrderId: nextOrderId })
                .then(() => console.log("LogisticsSystemConfig saved"));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Return all orders
    return await Order.find();
});

// Find warehouses that have these products
async function pickFromWharehouses(
    listOfProducts: { productId: number, quantity: number }[]
) {

    // Total amount of products
    let totalAmount = 0;
    listOfProducts.forEach(element => {
        totalAmount += element.quantity;
    });

    // Highest % of order completion
    let bestScore = 0;

    // Id of the best warehouse
    let bestWarehouse = 0;

    // Return value
    let returnList = [];

    // Demands met by this warehouse
    let demandsMet = [];

    // Demands left after this warehouse
    let demandsLeft = [];

    // Iterate through all warehouses
    let whCursor = await Warehouse.find().cursor();
    for (let doc = await whCursor.next(); doc != null; doc = await whCursor.next()) {

        // Create a list of demands
        let demands = structuredClone(listOfProducts);

        // Iterate through the demands
        demands.forEach(requestedProduct => {

            // Iterate through the stock
            for (let i = 0; i < doc.stock.length; i++) {

                // If the id matches subtract the quantity from the demand
                if (doc.stock[i].productId == requestedProduct.productId) {
                    requestedProduct.quantity -= doc.stock[i]?.quantity || 0;
                }
                if (requestedProduct.quantity <= 0) {
                    requestedProduct.quantity = 0;
                    break;
                }
            };
        });

        // Calculate the % of order completion
        let sum = 0;
        demands.forEach(requestedProduct => {
            sum += requestedProduct.quantity;
        });

        // If this warehouse has a higher % of order completion than the best
        if (1 - (sum / totalAmount) > bestScore) {

            // Update the best id to this warehouse
            bestWarehouse = doc?.warehouseId || 0;

            // Update the demands left and met and the score
            demandsMet = [];
            demandsLeft = [];
            bestScore = 1 - (sum / totalAmount);

            for (let i = 0; i < listOfProducts.length; i++) {
                // If the demand for a certain product is now less than the initial demand mark off that amount as met
                if (demands[i].quantity < listOfProducts[i].quantity) {
                    demandsMet.push({
                        productId: listOfProducts[i].productId,
                        quantity: listOfProducts[i].quantity - demands[i].quantity
                    });
                }
                // If the demand for a certain product is not 0 add it to the demands left
                if (demands[i].quantity > 0) {
                    demandsLeft.push(demands[i]);
                }
            }
        }

        // If the score is 0 then this warehouse is of no use
        if (sum / totalAmount == 0) {
            break;
        }
    }


    // If the score of the best warehouse is 0 then no warehouse can fulfill this order
    if (bestScore == 0) {
        console.log("No warehouses can fulfill this order");
        return null;
    } else {

        // After finding the best warehouse, remove the products from the stock
        let warehouse = await Warehouse.findOne({ warehouseId: bestWarehouse });
        let productsToRemove = demandsMet;

        productsToRemove.forEach(removeElement => {
            if (warehouse != undefined) {
                for (let i = 0; i < warehouse.stock.length || 0; i++) {
                    if (warehouse.stock[i].productId == removeElement.productId &&
                        warehouse.stock[i].quantity != null) {

                        if (warehouse.stock[i].quantity < removeElement.quantity) {
                            removeElement.quantity -= warehouse.stock[i].quantity;
                            warehouse.stock[i].quantity = 0;
                        }
                        else {
                            warehouse.stock[i].quantity -= removeElement.quantity;
                        }
                    }
                }
            }
        });

        // Save the demands that were met to the return list
        returnList.push({
            warehouseId: bestWarehouse,
            demandsMet: demandsMet
        });

        // If there are still demands left, call this function again with the demands left
        if (bestScore < 1) {

            let wareHouseSources = await pickFromWharehouses(demandsLeft);

            if (wareHouseSources != null) {
                // Add the demands met by other warehouses to the return list
                wareHouseSources.forEach(element => returnList.push(element));
            }
            else {
                // ---
                // BUG
                // ---
                // If this happens then the order could not be fulfilled but products were still removed from the stock
                return null;
            }
        }
    }

    // Return the return list
    return returnList;
}

// First endpoint, kept for nostalgic reasons
server.get('/', () => '<h1>SALUTATIONS!</h1>');

// ...
server.get('/currentWorkers', (date) => {
    let currentWorkers = [];
    for (let i = 0; i < 10; i++) {
        currentWorkers.push({
            id: i,
            name: `Worker ${i}`,
        });
    }
    return currentWorkers;
});

// get all warehouses with this product
server.get('/stock/products/:id', async ({ params }) => {

    let returnList = [];
    let whCursor = Warehouse.find().cursor();

    // Iterate through all warehouses
    for (let doc = await whCursor.next(); doc != null; doc = await whCursor.next()) {

        // Create a warehouse log
        let whLog = {
            warehouseId: doc.warehouseId,
            amount: 0
        };

        // Iterate through all products in the warehouse
        doc.stock.forEach(element => {
            // If the product is the id matches add the quantity to the log
            if (element.productId == parseInt(params.id)) {
                whLog.amount += element?.quantity || 0;
            }
        });

        // If the log has a positive amount, add it to the return list
        if (whLog.amount > 0) {
            returnList.push(whLog);
        }
    }

    // Return the warehouses with the product
    return returnList;
});


// Start server
server.listen(8080);

// Status message
console.log("Bun Bun listenening to port 8080!");

// Connect to database
mongoose.connect(`mongodb+srv://${Bun.env.MONGOOSE_USERNAME}:${Bun.env.MONGOOSE_PASSWORD}@logisticssystem.1yypplx.mongodb.net/Kitty?retryWrites=true&w=majority`)
    .then(() => console.log("Connected"));