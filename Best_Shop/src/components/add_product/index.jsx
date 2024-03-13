import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import requestApi from "../../utils/axios";
import apiHost from "../../utils/api";
import Select from "react-select";
import "./add_product.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputBox from "../InputBox/inputbox";
import CategoryDialog from "../CustomDialog/customdialog";
import CustomDialog from "../CustomDialog/customdialog";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import Button from "@mui/material/Button";

function AddStocks({ text }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [itemNames, setItemNames] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellingprice, setSellingPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [purchaseprice, setPurchasePrice] = useState(1);
  const [errors, setErrors] = useState([]);
  const [bill, setBill] = useState("");
  const navigate = useNavigate();
  // value
  const [categoryvalue, setCategoryValue] = useState("");
  const [categoryimage, setCategoryImage] = useState(null);
  const [itemvalue, setItemValue] = useState("");
  const [itemimage, setItemImage] = useState(null);
  const [subvalue, setSubValue] = useState("");
  const [subimage, setSubImage] = useState(null);
  const [brandvalue, setBrandValue] = useState("");
  const [brandimage, setBrandImage] = useState(null);

  // dialogs
  const [categoryopen, setCategoryOpen] = useState(false);
  const [itemopen, setItemOpen] = useState(false);
  const [subopen, setSubOpen] = useState(false);
  const [brandopen, setBrandOpen] = useState(false);

  // category dialog
  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };
  const handleCategoryClose = () => {
    setCategoryOpen(false);
  };

  const handleCategoryImage = (event) => {
    setCategoryImage(event.target.files[0]);
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", categoryvalue);
    formData.append("image", categoryimage);

    try {
      const response = await fetch(
        "http://localhost:5000/api/structure/category",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      fetchCategories();
      setCategoryOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // item dialog
  const handleItemOpen = () => {
    setItemOpen(true);
  };
  const handleItemClose = () => {
    setItemOpen(false);
  };
  const handleItemChange = (event) => {
    setItemValue(event.target.value);
  };
  const handleItemImage = (event) => {
    const file = event.target.files[0];
    setItemImage(file);
  };
  const handleItemSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("category", selectedCategory.id);
      formData.append("name", itemvalue);
      if (itemimage) {
        formData.append("image", itemimage);
      }
      // Log the FormData object to see its contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await requestApi(
        "POST",
        "/api/structure/item-name",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        console.log("Item added successfully");
        fetchItemNames(selectedCategory.id);
      } else {
        console.error("Error adding item:", response.error);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setItemOpen(false); // Close the dialog after submission
  };
  // sub dialog
  const handleSubOpen = () => {
    setSubOpen(true);
  };
  const handleSubClose = () => {
    setSubOpen(false);
  };
  const handleSubChange = (event) => {
    setSubValue(event.target.value);
  };

  const handleSubImage = (event) => {
    const file = event.target.files[0];
    setSubImage(file);
  };
  const handleSubSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("item_name", selectedItemName.id);
      formData.append("name", subvalue);
      if (subimage) {
        formData.append("image", subimage);
      }
      // Log the FormData object to see its contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await requestApi(
        "POST",
        "/api/structure/sub-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        console.log("SubCategory added successfully");
        fetchSubCategories(selectedItemName.id);
      } else {
        console.error("Error adding Sub:", response.error);
      }
    } catch (error) {
      console.error("Error adding Sub:", error);
    }
    setSubOpen(false); // Close the dialog after submission
  };

  // brand dialog
  const handleBrandOpen = () => {
    setBrandOpen(true);
  };
  const handleBrandClose = () => {
    setBrandOpen(false);
  };
  const handleBrandChange = (event) => {
    setBrandValue(event.target.value);
  };

  const handleBrandImage = (event) => {
    const file = event.target.files[0];
    setBrandImage(file);
  };
  const handleBrandSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("sub_category", selectedSubCategory.id);
      formData.append("name", brandvalue);
      if (brandimage) {
        formData.append("image_path", brandimage);
      }
      // Log the FormData object to see its contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await requestApi(
        "POST",
        "/api/structure/brand",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        console.log("Brand added successfully");
        fetchBrands(selectedSubCategory.id);
      } else {
        console.error("Error adding Brand:", response.error);
      }
    } catch (error) {
      console.error("Error adding Brand:", error);
    }
    setBrandOpen(false); // Close the dialog after submission
  };
  // navigate
  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await requestApi("GET", "/api/structure/category", {});
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setIsLoading(false);
  };

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    setSelectedItemName(null);
    setSelectedSubCategory(null);
    setSelectedBrand(null);
    fetchItemNames(category.id);
  };

  const handleSelectItemName = async (itemName) => {
    setSelectedItemName(itemName);
    setSelectedSubCategory(null);
    setSelectedBrand(null);
    fetchSubCategories(itemName.id);
  };

  const handleSelectSubCategory = async (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedBrand(null);
    fetchBrands(subCategory.id);
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null); // Reset selected model when brand changes
    fetchModels(brand.id);
  };

  const handleSelectedModel = (model) => {
    setSelectedModel(model);
    setSelectedColor(null); // Reset selected color when model changes
    fetchColors(model.value); // Fetch colors for the selected model
  };

  const handleSelectedColor = (color) => {
    setSelectedColor(color);
    fetchSizes(color.value);
  };

  // model data
  const modelOptions = models.map((model) => ({
    value: model.id,
    label: model.name,
  }));

  // color data
  const colorOptions = colors.map((color) => ({
    value: color.id,
    label: color.name,
  }));

  // size and quantity
  const handleSizeQuantity = (sizeId, value) => {
    setSizeQuantities((prevQuantity) => ({
      ...prevQuantity,
      [sizeId]: value,
    }));
  };

  const filterData = (data) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  const handleNumberChange = (e, setValue) => {
    const inputValue = e.target.value;

    if (/^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  // selling and purchasing price
  const handleSellingPriceChange = (e) => {
    const value = e.target.value;
    setSellingPrice(value);
    // Automatically update Purchasing Price based on Selling Price
    setMrp(value);
  };

  const handleMrpPriceChange = (e) => {
    const value = e.target.value;
    setMrp(value);
  };

  // refresh data.
  const handleRefresh = () => {
    setSellingPrice("");
    setMrp("");
    setModels([]);
  };

  const handleGenerate = async () => {
    const sizeIds = Object.keys(sizeQuantities).map((sizeId) =>
      parseInt(sizeId)
    );
    const quantities = Object.values(sizeQuantities).map((quantity) =>
      parseInt(quantity)
    );

    const data = {
      bill_number: parseInt(bill),
      category: selectedCategory.id,
      item_name: selectedItemName.id,
      sub_category: selectedSubCategory.id,
      brand: selectedBrand.id,
      model: selectedModel.value,
      color: selectedColor.value,
      selling_price: parseInt(sellingprice),
      purchasing_price: parseInt(purchaseprice),
      mrp: parseInt(mrp),
      size: sizeIds,
      quantity: quantities,

      name: [
        selectedCategory.name,
        selectedItemName.name,
        selectedSubCategory.name,
        selectedBrand.name,
      ].join("-"),
    };
    console.log(data);

    try {
      const response = await requestApi("POST", "/api/stock/stock", data, {});
      if (response.success) {
        console.log("Stock Added Successfully:", response.data);
      } else {
        console.error("Error Adding Stocks:", response.error);
      }
    } catch (error) {
      console.log("Error adding stocks:", error);
    }
  };

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchItemNames = async (categoryId) => {
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/item-name?category=${categoryId}`,
        {}
      );
      if (response.success) {
        setItemNames(response.data);
      }
    } catch (error) {
      console.error("Error fetching item names:", error);
    }
  };

  const fetchSubCategories = async (itemNameId) => {
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/sub-category?item_name=${itemNameId}`,
        {}
      );
      if (response.success) {
        setSubCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  const fetchBrands = async (subCategoryId) => {
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/brand?sub_category=${subCategoryId}`,
        {}
      );
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchModels = async (brandId) => {
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/model?brand=${brandId}`,
        {}
      );
      if (response.success) {
        setModels(response.data);
      }
    } catch (error) {
      console.error("Error fetching model:", error);
    }
  };

  const fetchColors = async (modelId) => {
    // Changed to modelId
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/color?model=${modelId}`,
        {}
      );
      if (response.success) {
        setColors(response.data);
      }
    } catch (error) {
      console.error("Error fetching Colors");
    }
  };

  const fetchSizes = async (colorId) => {
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/size?color=${colorId}`,
        {}
      );
      if (response.success) {
        setSizes(response.data);
        const initialQuantity = {};
        response.data.forEach((size) => {
          initialQuantity[size.id] = "";
        });
        setSizeQuantities(initialQuantity);
      }
    } catch (error) {
      console.error("Error fetching size:", error);
    }
  };

  const sizeInputs = () => {
    return sizes.map((size) => (
      <div className="sizeandquantity" key={size.id}>
        <label>{size.name} :</label>
        <input
          className="input_box-1"
          type="number"
          value={sizeQuantities[size.id]}
          onChange={(e) => handleSizeQuantity(size.id, e.target.value)}
        />
      </div>
    ));
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="vandc-container">
        <VerticalNavbar />
        <ToastContainer />
        <div className="dashboard-body">
          <div className="category-page">
            <div className="select-category-card">
              {selectedCategory ? null : <h2>Select a Category</h2>}
              <div className="selected-info">
                {selectedBrand &&
                  (selectedBrand.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedBrand.image_path}
                      alt={selectedBrand.name}
                    />
                  ) : (
                    <p>{selectedBrand.name}</p>
                  ))}
                {selectedSubCategory &&
                  (selectedSubCategory.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedSubCategory.image_path}
                      alt={selectedSubCategory.name}
                    />
                  ) : (
                    <p>{selectedSubCategory.name}</p>
                  ))}
                {selectedItemName &&
                  (selectedItemName.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedItemName.image_path}
                      alt={selectedItemName.name}
                    />
                  ) : (
                    <p>{selectedItemName.name}</p>
                  ))}
                {selectedCategory &&
                  (selectedCategory.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedCategory.image_path}
                      alt={selectedCategory.name}
                    />
                  ) : (
                    <p>{selectedCategory.name}</p>
                  ))}
              </div>
            </div>

            <div className="search-and-product-type-grid">
              <div className="search-container">
                <h3 className="search-label">Search:</h3>
                <input
                  className="input_box"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
              {isLoading && <p>Loading categories...</p>}
              {!isLoading && (
                <div className="card-container">
                  {/* Categories */}
                  {selectedCategory === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <h2>Select a Category</h2>
                        <AddCircleOutlinedIcon onClick={handleCategoryOpen} />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(categories).map((category) => (
                            <div
                              key={category.id}
                              className="item-card"
                              onClick={() => handleSelectCategory(category)}
                            >
                              <div className="category-info">
                                {category.name}
                                {category.image_path && (
                                  <img
                                    src={`${apiHost}/` + category.image_path}
                                    alt={category.name}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Item Names */}
                  {selectedCategory && selectedItemName === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <h2>
                          <center>Item Name</center>
                        </h2>
                        <AddCircleOutlinedIcon onClick={handleItemOpen} />
                        <CustomDialog
                          open={itemopen}
                          handleClose={handleItemClose}
                          handleSubmit={handleItemSubmit}
                          label="Add Item"
                          title="Add Item"
                          type="text"
                          onChange={handleItemChange}
                          value={itemvalue}
                          id="new_item"
                          size="small"
                          handleImageUpload={handleItemImage}
                          image={itemimage}
                        />
                      </div>

                      <div className="card">
                        {filterData(itemNames).map((itemName) => (
                          <div
                            key={itemName.id}
                            onClick={() => handleSelectItemName(itemName)}
                            className="item-card"
                          >
                            {itemName.name}
                            {itemName.image_path && (
                              <img
                                src={itemName.image_path}
                                alt={itemName.name}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub Categories */}
                  {selectedItemName && selectedSubCategory === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <h2>
                          <center>Select a Sub-Category</center>
                        </h2>
                        <AddCircleOutlinedIcon onClick={handleSubOpen} />
                        <CustomDialog
                          open={subopen}
                          handleClose={handleSubClose}
                          handleSubmit={handleSubSubmit}
                          label="Add Sub-Category"
                          title="Add Sub-Category"
                          type="text"
                          onChange={handleSubChange}
                          value={subvalue}
                          id="new_sub"
                          size="small"
                          handleImageUpload={handleSubImage}
                          image={subimage}
                        />
                      </div>
                      <div className="card">
                        {filterData(subCategories).map((subCategory) => (
                          <div
                            key={subCategory.id}
                            onClick={() => handleSelectSubCategory(subCategory)}
                            className="sub-category-card"
                          >
                            {subCategory.name}
                            <img src={subCategory.image_path} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brands */}
                  {selectedSubCategory && selectedBrand === null && (
                    <div className="card">
                      <div className="name-and-icon">
                        <h2>
                          <center>Select a Brand</center>
                        </h2>
                        <AddCircleOutlinedIcon onClick={handleBrandOpen} />
                        <CustomDialog
                          open={brandopen}
                          handleClose={handleBrandClose}
                          handleSubmit={handleBrandSubmit}
                          label="Add Brand"
                          title="Add Brand"
                          type="text"
                          onChange={handleBrandChange}
                          value={brandvalue}
                          id="new_brand"
                          size="small"
                          handleImageUpload={handleBrandImage}
                          image={brandimage}
                        />
                      </div>
                      <div className="card">
                        {filterData(brands).map((brand) => (
                          <div
                            key={brand.id}
                            onClick={() => handleSelectBrand(brand)}
                            className="brand-card"
                          >
                            {brand.name}
                            {brand.image_path && (
                              <img src={brand.image_path} alt={brand.name} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedBrand && (
                    // Last page for size and price
                    <div className="last">
                      <div className="part_for_size">
                        <div className="count-size-quantity-box">
                          <div className="count-div">
                            <div className="count_lable">
                              <b>Select a Model</b>
                              <Select
                                options={modelOptions}
                                onChange={(selectedOption) => {
                                  setSelectedModel(selectedOption);
                                  handleSelectedModel(selectedOption);
                                }}
                                value={selectedModel}
                              />
                            </div>

                            <div className="count_lable">
                              <b>Select a Color</b>
                              <Select
                                options={colorOptions}
                                onChange={(selectedColorOp) => {
                                  setSelectedColor(selectedColorOp);
                                  handleSelectedColor(selectedColorOp);
                                }}
                                value={selectedColor}
                              />
                            </div>
                          </div>

                          <div className="size-and-quantity">
                            <div>
                              <b>Size and Quantity</b>
                            </div>

                            {sizeInputs()}
                          </div>
                        </div>
                      </div>

                      <div className="part_for_price">
                        <div className="price-boxes">
                          <div className="centering">
                            <div className="input-container">
                              <label htmlFor="selling_price">Bill:</label>
                              <input
                                placeholder="Enter Bill No.."
                                className="input_box"
                                type="number"
                                id="bill"
                                value={bill}
                                onChange={(e) => setBill(e.target.value)}
                                required
                              />
                            </div>
                            <div className="input-container">
                              <label htmlFor="selling_price">
                                Selling Price:
                              </label>
                              <input
                                placeholder="Enter Selling Price"
                                className="input_box"
                                type="text"
                                id="sellingprice"
                                value={sellingprice}
                                onChange={handleSellingPriceChange}
                                required
                              />
                            </div>
                            <div className="input-container">
                              <label htmlFor="mrp">MRP:</label>
                              <input
                                placeholder="Enter MRP"
                                className="input_box"
                                type="text"
                                id="mrp"
                                value={mrp}
                                required
                                onChange={handleMrpPriceChange}
                              />
                            </div>
                            <div className="input-container">
                              <label htmlFor="price">Purchasing Price:</label>
                              <input
                                placeholder="Enter Purchasing Price"
                                className="input_box"
                                type="text"
                                id="purchaseprice"
                                value={purchaseprice}
                                required
                                onChange={(e) =>
                                  handleNumberChange(e, setPurchasePrice)
                                }
                              />
                            </div>
                            <div className="buttons-in-line">
                              <button
                                className="generate_button"
                                onClick={() => {
                                  handleGenerate();
                                  handleNavigate("/productdashboard");
                                }}
                              >
                                Generate +
                              </button>
                              <button
                                className="generate_button"
                                onClick={() => {
                                  handleGenerate();
                                  handleRefresh();
                                }}
                              >
                                Add other
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* category dialog */}
      <div>
        <Dialog
          open={categoryopen}
          onClose={handleCategoryClose}
          PaperProps={{
            style: {
              padding: "10px",
            },
          }}
        >
          <form onSubmit={handleCategorySubmit}>
            <div>
              <DialogTitle
                style={{
                  textAlign: "center",
                }}
              >
                <h2>Add Category</h2>
              </DialogTitle>
              <DialogContent
                style={{
                  fontSize: 20,
                }}
              >
                <br />
                <InputBox
                  type="text"
                  label="Add Category"
                  id="categoryvalue"
                  name="category_name"
                  value={categoryvalue}
                  onChange={(e) => setCategoryValue(e.target.value)}
                  required
                  size="small"
                />
                <br />
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleCategoryImage}
                />
                <br />
                <button>Add</button>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCategoryClose}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    handleCategorySubmit();
                    handleCategoryClose();
                  }}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Submit
                </Button>
              </DialogActions>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
}

export default AddStocks;
