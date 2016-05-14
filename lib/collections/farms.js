Farms = new Mongo.Collection('farms'); // รายละเอียดฟาร์ม
FarmCats = new Mongo.Collection('farm_cats'); // รายละเอียดแมว

//=================================================
// Schema
//=================================================

FarmSchema = new SimpleSchema({
  farm_owner_user_id: { 
    type: Object,
    label: "User Id",
    autoValue: function(){
      return this.userId;
    },
    autoform: {
      type: "hidden"
    }
  },
  farm_name: { type: String, label: "ชื่อฟาร์ม" },
  farm_url: { type: String, label: "Url ของฟาร์ม (ภาษาอังกฤษเท่านั้น)" },
  farm_desc: { 
    type: String,
    label: "คำอธิบายฟาร์ม",
    autoform: {
      type: "textarea"
    } 
  },
  farm_logo: { 
    type: String, 
    label: "โลโก้ฟาร์ม",
    autoform: {
      type: "file"
    }
  },
  farm_cover: { 
    type: String, 
    label: "หน้าปกฟาร์ม",
    autoform: {
      type: "file"
    } 
  },
  farm_editor_header: { 
    type: String, 
    label: "ข้อมูลเริ่ม",
    autoform: {
      type: "textarea"
    }  
  },
  farm_editor_contactus: { 
    type: String, 
    label: "ข้อมูลส่วนติดต่อเรา",
    autoform: {
      type: "textarea"
    }  
  },
  farm_mobilephone: { type: String, label: "เบอร์มือถือ" },
  farm_map: { 
    type: String, 
    label: "Link แผนที่ฟาร์ม จาก Google Maps"
  },
  farm_instagram: { type: String, label: "Instagram" },
  farm_line: { type: String, label: "Line Id" },
  farm_facebook: { type: String, label: "Facebook" },
  farm_promotion: { 
    type: String, 
    label: "ข้อมูลโปรโมชั่น",
    autoform: {
      type: "textarea"
    }  
  },
  create_at: { 
    type: Date,
    autoValue: function(){
      return new Date();
    },
    autoform: {
      type: "hidden"
    }  
  },
  update_at: { 
    type: Date,
    autoValue: function(){
      return new Date();
    },
    autoform: {
      type: "hidden"
    } 
  }
});

Farms.attachSchema(FarmSchema);

FarmCatSchema = new SimpleSchema({
  farm_id: { type: Object },
  cat_name: { type: String }, // ชื่อแมว
  cat_breed: { type: Object }, // สายพันธุ์
  cat_color: { type: Object }, // สี
  cat_sex: { type: Object }, // เพศ
  cat_character: { type: String }, // ลักษณะพิเศษ
  cat_birthday: { type: Date }, // วันเกิด
  cat_price: { type: Number }, // ราคา
  cat_price_sale: { type: Number }, // ราคาพิเศษ
  cat_medical_history: { type: String }, // ประวัติทางการแพทย์
  cat_pedigree_certificate: { type: String }, // ใบรับรองสายเลือด
  cat_father_image: { type: String },
  cat_mother_image: { type: String },
  create_at: { type: Date },
  update_at: { type: Date }
});

FarmCats.attachSchema(FarmCatSchema);

//=================================================
// Allow & Deny
//=================================================

Farms.allow({
  // can update if userId exists
  update: function(userId, doc){
    return !!userId;
  }
});