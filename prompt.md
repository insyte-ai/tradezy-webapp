We need to build a b2b portal that connects the sellers and buyers. This is similar to https://www.faire.com/ but witha broader scope. We will initially start with home but will expand to other areas like, hotel, office supplies etc. The end users will see the products but not the pricing. To view the wholesale prices, one would have to become a buyer and go through a sign up process and approved by the admin.

This will be a MERN stack with tailwind css. Frontend and backend and website within the same repo. The static website will be part of the webapp and it will dispaly the products from the database.

Please create a PRD and implementation plan

we will be building the following components:

- auth
- backend
- seller signup and portal
- buyer signup and portal
- admin portal
- website
- sellers shoudl be able to
  - add and manage products
  - manage inventory
  - manage storefront
  - manage orders
  - manage payments
  - manage users
  - Respond to RFQs
- buyers should be able to
  - should be able to view wholesale prices
  - place order
  - manage orders
  - Submit RFQ

Note this will be b2b and not b2c pltform.

Below are the category, sub-category and product category

1. Furniture & Furnishings

Residential Furniture:

Living Room & Bedroom Sets
Dining Room Furniture
Outdoor & Patio Furniture
Kids & Nursery Furniture

Commercial Furniture:

Office Furniture & Workstations
Hotel & Hospitality Furniture
Restaurant & Café Furniture
Retail Store Fixtures
Healthcare Furniture
Educational Furniture
Reception & Lobby Furniture
Conference Room Furniture

Institutional Furniture:

Government Office Furniture
Airport & Transit Seating
Stadium & Arena Seating
Library Furniture
Laboratory Furniture 2. Office Supplies & Business Equipment

Office Supplies:

Stationery & Paper Products
Writing Instruments & Markers
Filing & Organization
Presentation Materials
Shipping & Packaging
Cleaning & Maintenance Supplies

Business Equipment:

Printers, Copiers & Scanners
Computers & IT Hardware
Telecommunications Equipment
Point of Sale Systems
Security Systems & Cameras
Audio/Visual Equipment
Office Electronics

Commercial Furniture:

Desks & Workstations
Office Chairs & Seating
Storage & Filing Systems
Conference & Meeting Room
Reception Area Furniture 3. Electronics & Technology

Consumer Electronics:

TVs & Audio Systems
Smart Home Devices
Gaming & Entertainment
Personal Electronics
Wearable Technology

Business Technology:

Networking & WiFi Equipment
Servers & Data Storage
Industrial Computers
Digital Signage
Communication Systems
Surveillance & Security Tech

Smart Systems:

Building Automation
Energy Management Systems
Access Control Systems
Intercom & Communication
Fire Safety & Detection 4. HVAC & Climate Solutions

Residential HVAC:

Central Air Conditioning
Heating Systems
Ventilation Equipment
Thermostats & Controls

Commercial HVAC:

Industrial Air Conditioning
Commercial Heating Units
Ventilation & Exhaust Systems
Chiller Systems
Cooling Towers
Air Handling Units
HVAC Controls & Automation

Specialized Climate:

Clean Room Systems
Industrial Refrigeration
Server Room Cooling
Medical Grade HVAC 5. Industrial Equipment & Machinery

Small Machinery:

Generators & Power Equipment
Compressors & Pumps
Pressure Washers
Welding Equipment
Material Handling Equipment

Construction Equipment:

Power Tools & Hand Tools
Construction Machinery
Safety Equipment & PPE
Scaffolding & Ladders
Concrete & Masonry Tools

Manufacturing Equipment:

Production Line Equipment
Quality Control Instruments
Packaging Machinery
Warehouse Automation
Industrial Robotics 6. Automotive & Transportation

Automotive Supplies:

Car Parts & Accessories
Automotive Tools
Car Care Products
Tires & Wheels
Auto Electronics

Commercial Vehicles:

Fleet Vehicle Parts
Truck Accessories
Construction Vehicle Parts
Maintenance Equipment
Fleet Management Systems

Transportation Equipment:

Material Handling Vehicles
Forklifts & Pallet Jacks
Loading Dock Equipment
Transportation Safety 7. Food Service & Hospitality

Commercial Kitchen Equipment:

Commercial Refrigeration
Cooking Equipment & Ranges
Food Preparation Equipment
Dishwashers & Cleaning
Food Storage & Shelving

Restaurant Supplies:

Tableware & Dinnerware
Kitchen Utensils & Tools
Serving Equipment
Bar Equipment & Supplies
Food Service Disposables

Hotel & Hospitality:

Hotel Room Furniture
Hospitality Linens
Housekeeping Supplies
Guest Amenities
Hospitality Technology 8. Healthcare & Medical

Medical Equipment:

Diagnostic Equipment
Patient Care Equipment
Medical Furniture
Laboratory Equipment
Sterilization Equipment

Healthcare Supplies:

Medical Consumables
Personal Protective Equipment
Cleaning & Disinfection
Patient Comfort Items
Medical Storage Solutions

Dental & Veterinary:

Dental Equipment
Veterinary Supplies
Specialized Furniture
Diagnostic Tools 9. Education & Childcare

Educational Furniture:

Classroom Desks & Chairs
Laboratory Furniture
Library Equipment
Playground Equipment
Sports Equipment

Educational Supplies:

Teaching Materials
Art & Craft Supplies
Science Equipment
Technology for Education
Books & Educational Media

Childcare Equipment:

Nursery Furniture
Safety Equipment
Play Equipment
Educational Toys
Childcare Supplies 10. Retail & Display

Store Fixtures:

Shelving & Display Units
Checkout Counters
Shopping Carts & Baskets
Mannequins & Display Forms
Retail Lighting

Visual Merchandising:

Display Props & Decorations
Signage & Graphics
Window Display Materials
Product Stands
Retail Storage Solutions

POS & Retail Tech:

Cash Registers & POS Systems
Barcode Scanners
Receipt Printers
Retail Security Systems
Inventory Management 11. Sports & Recreation

Fitness Equipment:

Gym Equipment
Home Fitness Machines
Sports Accessories
Outdoor Recreation
Pool & Spa Equipment

Commercial Recreation:

Playground Equipment
Sports Facility Equipment
Entertainment Systems
Recreational Furniture
Safety Equipment 12. Agricultural & Landscaping

Agricultural Equipment:

Farming Tools & Machinery
Irrigation Systems
Greenhouses & Growing
Agricultural Supplies
Livestock Equipment

Landscaping & Grounds:

Lawn Care Equipment
Garden Tools & Supplies
Irrigation & Watering
Landscape Lighting
Outdoor Maintenance 13. Safety & Security

Security Systems:

CCTV & Surveillance
Access Control Systems
Alarm Systems
Security Lighting
Perimeter Security

Safety Equipment:

Fire Safety Systems
Emergency Equipment
Personal Protective Equipment
Safety Signage
First Aid Supplies

Industrial Safety:

Workplace Safety Equipment
Traffic Control
Industrial Lighting
Emergency Response
Safety Training Materials 14. Cleaning & Maintenance

Commercial Cleaning:

Industrial Cleaning Equipment
Janitorial Supplies
Floor Care Equipment
Pressure Washers
Window Cleaning Equipment

Facility Maintenance:

Building Maintenance Supplies
HVAC Maintenance
Electrical Maintenance
Plumbing Supplies
General Repair Tools 15. Textiles & Apparel

Commercial Textiles:

Hotel & Restaurant Linens
Industrial Textiles
Uniforms & Workwear
Promotional Apparel
Specialty Fabrics

Textile Equipment:

Laundry Equipment
Textile Processing
Sewing & Tailoring
Fabric Care Products 16. Energy & Utilities

Power Generation:

Solar Panels & Systems
Generators & Backup Power
Battery Systems
Inverters & Controllers
Electrical Distribution

Energy Efficiency:

LED Lighting Systems
Energy Management
Insulation Materials
Smart Meters
Power Factor Correction 17. Chemicals & Raw Materials

Industrial Chemicals:

Cleaning Chemicals
Manufacturing Chemicals
Water Treatment Chemicals
Specialty Chemicals
Chemical Storage & Handling

Raw Materials:

Building Materials
Packaging Materials
Textile Materials
Metal & Plastics
Adhesives & Sealants 18. Specialized Industries

Oil & Gas:

Pipeline Equipment
Safety Equipment
Drilling Supplies
Refinery Equipment

Marine & Maritime:

Marine Equipment
Port Equipment
Ship Supplies
Navigation Systems

Aviation:

Ground Support Equipment
Aviation Supplies
Airport Equipment
Aircraft Parts
