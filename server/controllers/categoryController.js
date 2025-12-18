// controllers/category.controller.js

const Category = require("../models/Category.js");
const slugify = require("slugify");
const User = require("../models/User.js");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;

    const slug = slugify(name, { lower: true });

    // Check if category already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      status,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// GET ALL CATEGORIES
// exports.getCategories = async (req, res) => {
//   try {

//     let filter = {parent: null,status:'active'}

//     if(req.query.parentid){
//       filter.parent  = req.query.parentid
//     }
//     const categories = await Category.find(filter).sort({ name: -1 });
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getCategories = async (req, res) => {
  try {

    const categories = await User.findById(req.user._id).populate('connections')
    res.status(200).json(categories.connections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      status: 'active'
    }).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CATEGORY BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    let updateData = req.body;

    if (name) {
      updateData.slug = slugify(name, { lower: true });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function f() {


// let cat = [
//   {
//     "category": "Electronics",
//     "subcategories": [
//       "Resistors",
//       "Capacitors",
//       "Inductors",
//       "Diodes",
//       "Transistors",
//       "IC Chips",
//       "Sensors",
//       "Arduino Boards",
//       "Raspberry Pi",
//       "PCB Board",
//       "Jumper Wires",
//       "Soldering Tools",
//       "Batteries",
//       "Power Supply"
//     ]
//   },
//   {
//     "category": "Electrical",
//     "subcategories": [
//       "Wires",
//       "Switches",
//       "Sockets",
//       "MCB",
//       "Fuses",
//       "LED Bulbs",
//       "Fans",
//       "Motors",
//       "Inverters",
//       "UPS",
//       "Distribution Board"
//     ]
//   },
//   {
//     "category": "Computer & Laptop",
//     "subcategories": [
//       "Laptops",
//       "Desktop PCs",
//       "Monitors",
//       "Keyboards",
//       "Mouse",
//       "RAM",
//       "SSD",
//       "HDD",
//       "Graphics Card",
//       "Printers",
//       "Routers",
//       "Network Switches"
//     ]
//   },
//   {
//     "category": "Mobile & Accessories",
//     "subcategories": [
//       "Smartphones",
//       "Chargers",
//       "Earphones",
//       "Headphones",
//       "Screen Guards",
//       "Mobile Covers",
//       "Power Banks",
//       "Bluetooth Devices"
//     ]
//   },
//   {
//     "category": "Networking & Security",
//     "subcategories": [
//       "Routers",
//       "Switches",
//       "LAN Cables",
//       "WiFi Extenders",
//       "CCTV Cameras",
//       "NVR",
//       "DVR",
//       "Biometric Machines",
//       "Access Control Systems"
//     ]
//   },
//   {
//     "category": "Mechanical Tools",
//     "subcategories": [
//       "Drill Machine",
//       "Grinder",
//       "Cutting Tools",
//       "Spanner Set",
//       "Hammer",
//       "Screwdriver Set",
//       "Bearings",
//       "Belts",
//       "Chains"
//     ]
//   },
//   {
//     "category": "Construction & Civil Material",
//     "subcategories": [
//       "Cement",
//       "Sand",
//       "Bricks",
//       "Steel Rods",
//       "Tiles",
//       "Marble",
//       "Paints",
//       "Plumbing Pipes",
//       "Bathroom Fittings"
//     ]
//   },
//   {
//     "category": "Automobile Parts",
//     "subcategories": [
//       "Engine Oil",
//       "Coolant",
//       "Brake Pads",
//       "Filters",
//       "Tyres",
//       "Tubes",
//       "Indicators",
//       "Clutch Plate",
//       "Chain Set"
//     ]
//   },
//   {
//     "category": "Hardware Store",
//     "subcategories": [
//       "Bolts",
//       "Nuts",
//       "Screws",
//       "Hinges",
//       "Locks",
//       "Door Handles",
//       "Adhesives",
//       "Sealants"
//     ]
//   },
//   {
//     "category": "Home Appliances",
//     "subcategories": [
//       "Refrigerators",
//       "Washing Machines",
//       "Televisions",
//       "Fans",
//       "Coolers",
//       "Air Conditioners",
//       "Heaters",
//       "Mixer Grinders"
//     ]
//   },
//   {
//     "category": "Chemical Store",
//     "subcategories": [
//       "Industrial Chemicals",
//       "Cleaning Chemicals",
//       "Solvents",
//       "Lubricants",
//       "Acids",
//       "Safety Gear"
//     ]
//   },
//   {
//     "category": "Lab & Scientific Instruments",
//     "subcategories": [
//       "Test Tubes",
//       "Beakers",
//       "Microscopes",
//       "Pipettes",
//       "Lab Coats",
//       "Gloves",
//       "Chemical Reagents"
//     ]
//   },
//   {
//     "category": "Books & Education",
//     "subcategories": [
//       "Engineering Books",
//       "Notes",
//       "Guides",
//       "Lab Manuals",
//       "Entrance Exam Books"
//     ]
//   },
//   {
//     "category": "Stationery",
//     "subcategories": [
//       "Pen",
//       "Pencil",
//       "Notebook",
//       "Files",
//       "Registers",
//       "Art Supplies"
//     ]
//   },
//   {
//     "category": "Safety Products",
//     "subcategories": [
//       "Helmets",
//       "Gloves",
//       "Safety Shoes",
//       "Masks",
//       "Reflective Jackets"
//     ]
//   },
//   {
//     "category": "Plumbing",
//     "subcategories": [
//       "PVC Pipes",
//       "CPVC Pipes",
//       "Water Taps",
//       "Sanitary Fittings",
//       "Water Pumps",
//       "Water Tanks"
//     ]
//   },
//   {
//     "category": "Furniture",
//     "subcategories": [
//       "Office Chairs",
//       "Tables",
//       "Wooden Shelves",
//       "Beds",
//       "Cupboards"
//     ]
//   },
//   {
//     "category": "Agriculture",
//     "subcategories": [
//       "Seeds",
//       "Fertilizers",
//       "Pesticides",
//       "Irrigation Pipes",
//       "Agriculture Tools"
//     ]
//   },
//   {
//     "category": "Printing & Photocopy",
//     "subcategories": [
//       "Printer Ink",
//       "Toner",
//       "Photo Paper",
//       "Lamination Sheets",
//       "Binding Material"
//     ]
//   },
//   {
//     "category": "Repair Services",
//     "subcategories": [
//       "Mobile Repair",
//       "Laptop Repair",
//       "Electrical Repair",
//       "Plumbing Service",
//       "Welding Service",
//       "Painting Service"
//     ]
//   }
// ]


let cat=
[
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
]



  for (let s in cat) {
      let data = {}
      
        data = {
          
          name: cat[s],
          slug: cat[s],
          parent:null
        }
        
  

      console.log("data",data);
      
      if(Object.values(data).length){

        let r = await Category.create(data)
        console.log("rrr",r);
      }
     
    }
      await sleep(1000)


}

// f()