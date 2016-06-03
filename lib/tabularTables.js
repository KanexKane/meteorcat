TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.AdminBlogCategories = new Tabular.Table({
    name: "AdminBlogCategories",
    collection: BlogCategories,
    columns: [
        {data: 'category_name', title: 'Category Name'},
        {data: 'category_slug',title: 'Category Slug'},
        {
            data: '_id', 
            title: '', 
            render: function (val, type, doc) {
                var pathEdit = Router.routes.AdminBlogCategoryEdit.path({_id: this._id});
                var text = '<a href="' + pathEdit + '" class="edit-category btn btn-success"><i class="fa fa-edit"></i></a>';
                text += '<a href="#" data-id="' + this._id + '" class="delete-category btn btn-danger"><i class="fa fa-remove"></i></a>';
                return text;
            }
        }
    ]
});

TabularTables.AdminBlogs = new Tabular.Table({
    name: "AdminBlogs",
    collection: BlogPosts,
    order: [[2, "desc"]],
    columns: [
        {
            data: 'post_title',
            title: 'Blog Name',
            render: function(val, type, doc) {
                let text = '<div>';
                text += val;
                text += '</div>';
                text += '<div>';
                text += '<a href="'+Router.routes.BlogDetail.path({post_slug: doc.post_slug, category: BlogCategories.findOne(doc.post_category).category_slug})+'" target="_blank">';
                text += 'ดูบทความ';
                text += '</a>';
                text += '</div>';
                return text;
            }
        },
        {
            data: 'post_slug',
            title: 'Blog Slug'
        },
        {
            data: 'post_category',
            title: 'Category Id',
            visible: false
        },
        {
            data: 'post_date',
            title: 'สร้างเมื่อ',
            render: function(val, type, doc) {
                if (val instanceof Date) {
                    return moment(val).add('543', 'years').format('DD/MM/YYYY');
                } else {
                    return "Never";
                }
            }
        },
        {
            data: '_id', 
            title: '', 
            render: function (val, type, doc) {
                var pathEdit = Router.routes.AdminBlogEdit.path({_id: this._id});
                var text = '<a href="' + pathEdit + '" class="edit-blog btn btn-success"><i class="fa fa-edit"></i></a>';
                text += '<a href="#" data-id="' + this._id + '" class="delete-blog btn btn-danger"><i class="fa fa-remove"></i></a>';
                return text;
            }
        }
    ]
});

TabularTables.MemberFarmCats = new Tabular.Table({
    name: "MemberFarmCats",
    collection: Cats,
    columns: [
        {data: 'cat_name', title: 'ชื่อแมว'},
        {
          data: "cat_breed",
          title: "สายพันธุ์",
          render: function (val, type, doc) {
            var myBreed = "";

            _.each(CatBreeds.find({}).fetch(), function(breed, i){
                if(breed._id == val){
                    myBreed = breed.breed_name;
                    return;
                }
            });
            return myBreed;
          }
        },
        {
            data: '_id',
            title: '',
            render: function(val, type, doc){
                var pathEdit = Router.routes.MemberFarmCatEdit.path({_id: this._id});
                var text = '<a href="' + pathEdit + '" class="edit-cat btn btn-success"><i class="fa fa-edit"></i></a>';
                text += ' <a href="#" data-id="' + this._id + '" class="delete-cat btn btn-danger"><i class="fa fa-remove"></i></a>';
                return text;
            }
        }
    ]
});