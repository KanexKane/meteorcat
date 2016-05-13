Farms = new Mongo.Collection('farms'); // รายละเอียดฟาร์ม
FarmCats = new Mongo.Collection('farm_cats'); // รายละเอียดแมว

//=================================================
// Schema
//=================================================
FarmSchema = new SimpleSchema({
  farm_owner_user_id: { 
    type: Object,
    autoValue: function(){
      return this.userId;
    }
  },
  farm_name: { type: String },
  farm_url: { type: String },
  farm_desc: { type: String },
  farm_logo: { type: String },
  farm_cover: { type: String },
  farm_editor_header: { type: String },
  farm_editor_contactus: { type: String },
  farm_mobilephone: { type: String },
  farm_map: { type: String },
  farm_instagram: { type: String },
  farm_line: { type: String },
  farm_facebook: { type: String },
  farm_promotion: { type: String },
  create_at: { type: Date },
  update_at: { type: Date }
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
// 
//=================================================