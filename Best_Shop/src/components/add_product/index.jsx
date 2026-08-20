import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Horizontal_Navbar/horizontal_navbar";
import VerticalNavbar from "../Vertical_Navbar/vertical_navbar";
import requestApi from "../../utils/axios";
import apiHost from "../../utils/api";
import "./add_product.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputBox from "../InputBox/inputbox";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomEditSelect from "./CustomEditSelect";

function AddStocks({ text }) {

  const [editedName, setEditedName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectEditCategory, setSelectEditCategory] = useState(null);

  const [editedItemName, setEditedItemName] = useState("");
  const [editModalItemOpen, setEditModalItemOpen] = useState(false);
  const [itemNames, setItemNames] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedEditItem, setSelectedEditItem] = useState(null);

  const [editSubName, setEditedSubName] = useState("");
  const [editModalSubOpen, setEditModalSubOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedEditSub, setSelectedEditSub] = useState(null);

  const [editBrandName, setEditedBrandName] = useState("");
  const [editModalBrandOpen, setEditModalBrandOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedEditBrand, setSelectedEditBrand] = useState(null);

  const [editModelName, setEditedModelName] = useState("");
  const [editModalModelOpen, setEditModalModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedEditModel, setSelectedEditModel] = useState(null);

  const [editColorName, setEditedColorName] = useState("");
  const [editModalColorOpen, setEditModalColorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedEditColor, setSelectedEditColor] = useState(null);

  const [editSizeName, setEditedSizeName] = useState("");
  const [sizes, setSizes] = useState([]);
  const [editModalSizeOpen, setEditModalSizeOpen] = useState(false);
  const [selectedEditSize, setSelectedEditSize] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [editOccasionName, setEditedOccasionName] = useState("");
  const [editModalOccasionOpen, setEditModalOccasionOpen] = useState(false);
  const [occasions, setOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedEditOccasion, setSelectedEditOccasion] = useState(null);

  const [editTypeName, setEditedTypeName] = useState("");
  const [editModalTypeOpen, setEditModalTypeOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedEditType, setSelectedEditType] = useState(null);

  const [showPricing, setShowPricing] = useState(false);

  const [showCategories, setShowCategories] = useState(true);
  const [showItemNames, setShowItemNames] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showOccasions, setShowOccasions] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [quantity, setQuantity] = useState("");

  const notifySuccess = (message) => {
    toast.success(message, { position: toast.POSITION.BOTTOM_LEFT });
  };

  const notifyError = (message) => {
    toast.error(message, { position: toast.POSITION.BOTTOM_LEFT });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellingprice, setSellingPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [purchaseprice, setPurchasePrice] = useState(1);
  // const [errors, setErrors] = useState([]);
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
  const [modelvalue, setModelValue] = useState("");
  const [colorvalue, setColorValue] = useState("");
  const [sizevalue, setSizeValue] = useState("");
  const [occasionvalue, setOccasionValue] = useState("");
  const [typevalue, setTypeValue] = useState("");

  const [masterCategories, setMasterCategories] = useState([]);
  const [masterBrands, setMasterBrands] = useState([]);
  const [masterColors, setMasterColors] = useState([]);
  const [masterItemNames, setMasterItemNames] = useState([]);
  const [masterModels, setMasterModels] = useState([]);
  const [masterSizes, setMasterSizes] = useState([]); 
  const [masterOccasions, setMasterOccasions] = useState([]);
  const [masterSubCategories, setMasterSubCategories] = useState([]);
  const [masterTypes, setMasterTypes] = useState([]);

  const fetchMasterData = async () => {
    try {
      const catRes = await requestApi("GET", "/api/master/category", {});
      if (catRes.success) setMasterCategories(catRes.data);

      const brandRes = await requestApi("GET", "/api/master/brand", {});
      if (brandRes.success) setMasterBrands(brandRes.data);

      const colorRes = await requestApi("GET", "/api/master/color", {});
      if (colorRes.success) setMasterColors(colorRes.data);

      const itemRes = await requestApi("GET", "/api/master/item-name", {});
      if (itemRes.success) setMasterItemNames(itemRes.data);

      const modelRes = await requestApi("GET", "/api/master/model", {});
      if (modelRes.success) setMasterModels(modelRes.data);

      const sizeRes = await requestApi("GET", "/api/master/size", {});
      if (sizeRes.success) setMasterSizes(sizeRes.data); 

      const occasionRes = await requestApi("GET", "/api/master/occasion", {});
      if (occasionRes.success) setMasterOccasions(occasionRes.data);

      const subRes = await requestApi("GET", "/api/master/sub-category", {});
      if (subRes.success) setMasterSubCategories(subRes.data);

      const typeRes = await requestApi("GET", "/api/master/type", {});
      if (typeRes.success) setMasterTypes(typeRes.data);
    } catch (err) {
      console.error("Error fetching master data:", err);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  // dialogs
  const [categoryopen, setCategoryOpen] = useState(false);
  const [itemopen, setItemOpen] = useState(false);
  const [subopen, setSubOpen] = useState(false);
  const [brandopen, setBrandOpen] = useState(false);
  const [modelopen, setModelOpen] = useState(false);
  const [coloropen, setColorOpen] = useState(false);
  const [sizeopen, setSizeOpen] = useState(false);
  const [occasionopen, setOccasionOpen] = useState(false);
  const [typeopen, setTypeOpen] = useState(false);
  // category dialog
  const handleCategoryOpen = () => {
    setCategoryValue("");
    setCategoryImage(null);
    setCategoryOpen(true);
  };
  const handleCategoryClose = () => {
    setCategoryValue("");
    setCategoryImage(null);
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
      const response = await fetch(`${apiHost}/api/structure/category`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        notifySuccess("Category Added Successfull");
        fetchCategories();
        setCategoryValue("");
        setCategoryImage(null);
        setCategoryOpen(false);
      } else {
        setCategoryValue("");
        setCategoryImage(null);
        setCategoryOpen(false);
      }
    } catch (error) {
      notifyError("Category Failed Added");
      setCategoryValue("");
      setCategoryImage(null);
      setCategoryOpen(false);
    }
  };

  // item dialog
  const handleItemOpen = () => {
    setItemValue("");
    setItemImage(null);
    setItemOpen(true);
  };
  const handleItemClose = () => {
    setItemValue("");
    setItemImage(null);
    setItemOpen(false);
  };

  const handleItemImage = (event) => {
    setItemImage(event.target.files[0]);
  };
  const handleItemSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("category", selectedCategory.id);
    formData.append("name", itemvalue);
    formData.append("image", itemimage);

    try {
      const response = await fetch(`${apiHost}/api/structure/item-name`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        fetchItemNames(selectedCategory.id);
        notifySuccess("Item-Name Added Successfull");
        setItemValue("");
        setItemImage(null);
        setItemOpen(false);
      } else {
        setItemValue("");
        setItemImage(null);
        setItemOpen(false);
      }
    } catch (error) {
      notifyError("Item-Name Failed to Add");
      setItemValue("");
      setItemImage(null);
      setItemOpen(false);
    }
  };

  // sub dialog
  const handleSubOpen = () => {
    setSubValue("");
    setSubImage(null);
    setSubOpen(true);
  };
  const handleSubClose = () => {
    setSubValue("");
    setSubImage(null);
    setSubOpen(false);
  };

  const handleSubImage = (event) => {
    setSubImage(event.target.files[0]);
  };
  const handleSubSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("item_name", selectedItemName.id);
    formData.append("name", subvalue);
    formData.append("image", subimage);

    try {
      const response = await fetch(`${apiHost}/api/structure/sub-category`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchSubCategories(selectedItemName.id);
        notifySuccess("Sub-Category Addded Successfull");
        setSubValue("");
        setSubImage(null);
        setSubOpen(false);
      } else {
        setSubValue("");
        setSubImage(null);
        setSubOpen(false);
      }
    } catch (error) {
      notifyError("Sub-Category Failed to Add");
      setSubValue("");
      setSubImage(null);
      setSubOpen(false);
    }
  };

  // brand dialog
  const handleBrandOpen = () => {
    setBrandValue("");
    setBrandImage(null);
    setBrandOpen(true);
  };
  const handleBrandClose = () => {
    setBrandValue("");
    setBrandImage(null);
    setBrandOpen(false);
  };

  const handleBrandImage = (event) => {
    setBrandImage(event.target.files[0]);
  };
  const handleBrandSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("sub_category", selectedSubCategory.id);
    formData.append("name", brandvalue);
    formData.append("image", brandimage);

    try {
      const response = await fetch(`${apiHost}/api/structure/brand`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        fetchBrands(selectedSubCategory.id);
        notifySuccess("Brand Added Successfull");
        setBrandValue("");
        setBrandImage(null);
        setBrandOpen(false);
      } else {
        setBrandValue("");
        setBrandImage(null);
        setBrandOpen(false);
      }
    } catch (error) {
      notifyError("Brand Failed to Add");
      setBrandValue("");
      setBrandImage(null);
      setBrandOpen(false);
    }
  };

  const handleModelOpen = () => {
    setModelValue("");
    setModelOpen(true);
  };
  const handleModelClose = () => {
    setModelValue("");
    setModelOpen(false);
  };

  const handleModelSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("brand", selectedBrand.id);
      formData.append("name", modelvalue);

      const response = await requestApi(
        "POST",
        "/api/structure/model",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        fetchModels(selectedBrand.id);
        notifySuccess("Model Added Successfull");
        setModelValue("");
        setModelOpen(false);
      } else {
        setModelValue("");
        setModelOpen(false);
      }
    } catch (error) {
      notifyError("Model Failed to Add");
      setModelValue("");
      setModelOpen(false);
    }
  };

  const handleColorOpen = () => {
    setColorValue("");
    setColorOpen(true);
  };
  const handleColorClose = () => {
    setColorValue("");
    setColorOpen(false);
  };

  const handleColorSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("model", selectedModel.id);
      formData.append("name", colorvalue);

      const response = await requestApi(
        "POST",
        "/api/structure/color",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        fetchColors(selectedModel.id);
        notifySuccess("Color Added Successfull");
        setColorValue("");
        setColorOpen(false);
      } else {
        setColorValue("");
        setColorOpen(false);
      }
    } catch (error) {
      notifyError("Color Failed to Add");
      setColorValue("");
      setColorOpen(false);
    }
  };

  const handleSizeOpen = () => {
    setSizeValue("");
    setSizeOpen(true);
  };
  const handleSizeClose = () => {
    setSizeValue("");
    setSizeOpen(false);
  };

  const handleSizeSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("color", selectedColor.id);
      formData.append("name", sizevalue);

      const response = await requestApi(
        "POST",
        "/api/structure/size",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        fetchSizes(selectedColor.id);
        notifySuccess("Size Added Successfull");
        setSizeValue("");
        setSizeOpen(false);
      } else {
        setSizeValue("");
        setSizeOpen(false);
      }
    } catch (error) {
      notifyError("Size Failed to Add");
      setSizeValue("");
      setSizeOpen(false);
    }
  };

  const handleOccasionOpen = () => {
    setOccasionValue("");
    setOccasionOpen(true);
  };
  const handleOccasionClose = () => {
    setOccasionValue("");
    setOccasionOpen(false);
  };

  const handleOccasionSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("size", selectedSize.id);
      formData.append("name", occasionvalue);

      const response = await requestApi("POST", "/api/structure/occasion", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.success) {
        fetchOccasions(selectedSize.id);
        notifySuccess("Occasion Added Successfully");
        setOccasionValue("");
        setOccasionOpen(false);
      } else {
        setOccasionValue("");
        setOccasionOpen(false);
      }
    } catch (error) {
      notifyError("Occasion Failed to Add");
      setOccasionValue("");
      setOccasionOpen(false);
    }
  };

  const handleTypeOpen = () => {
    setTypeValue("");
    setTypeOpen(true);
  };
  const handleTypeClose = () => {
    setTypeValue("");
    setTypeOpen(false);
  };

  const handleTypeSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("occasion", selectedOccasion.id);
      formData.append("name", typevalue);

      const response = await requestApi("POST", "/api/structure/type", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.success) {
        fetchTypes(selectedOccasion.id);
        notifySuccess("Type Added Successfully");
        setTypeValue("");
        setTypeOpen(false);
      } else {
        setTypeValue("");
        setTypeOpen(false);
      }
    } catch (error) {
      notifyError("Type Failed to Add");
      setTypeValue("");
      setTypeOpen(false);
    }
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
    } catch (error) {}
    setIsLoading(false);
  };

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
    setShowItemNames(true);
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
    setShowItemNames(false);
    setShowSubCategories(true);
  };

  const handleSelectSubCategory = async (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedBrand(null);
    fetchBrands(subCategory.id);
    setShowSubCategories(false);
    setShowBrands(true);
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    fetchModels(brand.id);
    setShowBrands(false);
    setShowModels(true);
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setSelectedColor(null);
    fetchColors(model.id);
    setShowModels(false);
    setShowColors(true);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    fetchSizes(color.id);
    setShowColors(false);
    setShowSizes(true);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setSelectedOccasion(null);
    fetchOccasions(size.id);
    setShowSizes(false);
    setShowOccasions(true);
  };

  const handleSelectOccasion = (occasion) => {
    setSelectedOccasion(occasion);
    setSelectedType(null);
    fetchTypes(occasion.id);
    setShowOccasions(false);
    setShowTypes(true);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setShowTypes(false);
    setShowPricing(true);
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
    setBill("");
    setQuantity("");
    setShowPricing(false);
  };

  const handleGenerate = async () => {
    try {
      const parsedQty = parseInt(quantity, 10);
      if (!parsedQty || parsedQty <= 0) {
        notifyError("Please enter a valid quantity.");
        return;
      }

      const bodyData = {
        bill_number: bill,
        category: selectedCategory.id,
        item_name: selectedItemName.id,
        sub_category: selectedSubCategory.id,
        brand: selectedBrand.id,
        model: selectedModel.id,
        color: selectedColor.id,
        size: [selectedSize.id],
        occasion: selectedOccasion.id,
        type: selectedType.id,
        quantity: [parsedQty],
        name: [
          selectedCategory.name,
          selectedItemName.name,
          selectedSubCategory.name,
          selectedBrand.name,
        ].join("-"),
        purchasing_price: purchaseprice,
        selling_price: sellingprice,
        mrp: mrp,
        location: 1,
        user_id: 1,
      };

      console.log(bodyData);

      const response = await requestApi("POST", "/api/stock/stock", bodyData, {});
      if (response.success) {
        notifySuccess("Stock Added Successfull");
      } else {
        notifyError("Stock Failed to Add");
      }
    } catch (error) {
      notifyError("Stock Failed to Add");
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
  };

  const fetchColors = async (modelId) => {
    try {
      const response = await requestApi(
        "GET",
        `/api/structure/color?model=${modelId}`,
        {}
      );
      if (response.success) {
        setColors(response.data);
      }
    } catch (error) {}
  };

  const fetchSizes = async (colorId) => {
    try {
      const response = await requestApi("GET", `/api/structure/size?color=${colorId}`, {});
      if (response.success) setSizes(response.data);
    } catch (error) {}
  };

  const fetchOccasions = async (sizeId) => {
    try {
      const response = await requestApi("GET", `/api/structure/occasion?size=${sizeId}`, {});
      if (response.success) setOccasions(response.data);
    } catch (error) {}
  };

  const fetchTypes = async (occasionId) => {
    try {
      const response = await requestApi("GET", `/api/structure/type?occasion=${occasionId}`, {});
      if (response.success) setTypes(response.data);
    } catch (error) {}
  };


  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectEditCategory(null);
    setEditedName("");
  };

  const handleNameChange = (event) => {
    setEditedName(event.target.value);
  };

  // edit and delete category
  const handleEdit = (id, name) => {
    setSelectEditCategory({ id, name });
    setEditedName(name);
    setEditModalOpen(true);
    console.log(id);
  };
  const handleUpdateCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/category`, {
        id: selectEditCategory.id,
        name: editedName,
      });
      console.log(response.data.message);
      const updatedCategory = { ...selectEditCategory, name: editedName };
      console.log(editedName);
      setCategories(
        categories.map((cat) =>
          cat.id === selectEditCategory.id ? updatedCategory : cat
        )
      );
      notifySuccess(`Category updated successfully`);
      handleEditModalClose();
    } catch (error) {
      console.error("Error updating category:", error);
      notifyError("Error updating category");
    }
  };
  const handleDelete = async (id, name) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete category "${name}"?`
      );

      if (confirmDelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/category?id=${id}`
        );
        console.log(response.data.message);
        setCategories(categories.filter((cat) => cat.id !== id));

        console.log(id);
        notifySuccess(`Category "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      notifyError("Error deleting category");
    }
  };

  // item edit and delete

  const handleItemNameChange = (event) => {
    setEditedItemName(event.target.value);
  };
  const handleItemEdit = (id, name) => {
    setSelectedEditItem({ id, name });
    setEditedItemName(name);
    setEditModalItemOpen(true);
  };

  const handleEditItemModalClose = () => {
    setEditModalItemOpen(false);
    setSelectedEditItem(null);
    setEditedItemName("");
  };

  const handleUpdateItem = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/item-name`, {
        id: selectedEditItem.id,
        name: editedItemName,
      });
      console.log(response.data.message);
      const updatedItem = { ...selectedEditItem, name: editedItemName };
      setItemNames(
        itemNames.map((cat) =>
          cat.id === selectedEditItem.id ? updatedItem : cat
        )
      );
      notifySuccess(`Item updated successfully`);
      handleEditItemModalClose();
    } catch (error) {
      console.error("Error updating Item:", error);
      notifyError("Error updating Item");
    }
  };

  const handleDeleteItem = async (id, name) => {
    try {
      const confrimdelete = window.confirm(
        `Are you sure you want to delete ItemName "${name}"?`
      );
      if (confrimdelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/item-name?id=${id}`
        );
        console.log(response.data.message);
        setItemNames(itemNames.filter((cat) => cat.id !== id));
        notifySuccess(`Item "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      notifyError("Error deleting category");
    }
  };

  // edit and delete sub
  const handleSubNameChange = (event) => {
    setEditedSubName(event.target.value);
  };

  const handleSubEdit = (id, name) => {
    setSelectedEditSub({ id, name });
    setEditedSubName(name);
    setEditModalSubOpen(true);
  };

  const handleEditModalSubClose = () => {
    setEditModalSubOpen(false);
    setSelectedEditSub(null);
    setEditedSubName("");
  };

  const handleUpdateSubCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/sub-category`, {
        id: selectedEditSub.id,
        name: editSubName,
      });
      console.log(response.data.message);
      const updatedSub = { ...selectedEditSub, name: editSubName };
      setSubCategories(
        subCategories.map((cat) =>
          cat.id === selectedEditSub.id ? updatedSub : cat
        )
      );
      notifySuccess(`Sub Category updated successfully`);
      handleEditModalSubClose();
    } catch (error) {
      console.error("Error updating Sub category:", error);
      notifyError("Error updating Sub category");
    }
  };

  const handleSubDelete = async (id, name) => {
    try {
      const confrimdelete = window.confirm(
        `Are you sure you want to delete sub-category "${name}"?`
      );
      if (confrimdelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/sub-category?id=${id}`
        );
        console.log(response.data.message);
        setSubCategories(subCategories.filter((cat) => cat.id !== id));
        notifySuccess(`Sub Category "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting Subcategory:", error);
      notifyError("Error deleting Sub category");
    }
  };

  // edit and delete brand
  const handleBrandEdit = (id, name) => {
    setSelectedEditBrand({ id, name });
    setEditedBrandName(name);
    setEditModalBrandOpen(true);
  };

  const handleEditModalBrandClose = () => {
    setEditModalBrandOpen(false);
    setSelectedEditBrand(null);
    setEditedBrandName("");
  };

  const handleBrandNameChange = (event) => {
    setEditedBrandName(event.target.value);
  };

  const handleUpdateBrandCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/brand`, {
        id: selectedEditBrand.id,
        name: editBrandName,
      });
      console.log(response.data.message);
      const updateBrand = { ...selectedEditBrand, name: editBrandName };
      setBrands(
        brands.map((mod) =>
          mod.id === selectedEditBrand.id ? updateBrand : mod
        )
      );
      notifySuccess(`Brand updated successfully`);
      handleEditModalBrandClose();
    } catch (error) {
      console.error("Error updating Brand:", error);
      notifyError("Error updating Brand");
    }
  };

  const handleBrandDelete = async (id, name) => {
    try {
      const confrimdelete = window.confirm(
        `Are you sure you wnat to delete brand "${name}"?`
      );
      if (confrimdelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/brand?id=${id}`
        );
        console.log(response.data.message);
        setBrands(brands.filter((mod) => mod.id !== id));
        notifySuccess(`Brand "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting Brand:", error);
      notifyError("Error deleting Brand");
    }
  };

  // edit and delete model
  const handleModelEdit = (id, name) => {
    setSelectedEditModel({ id, name });
    setEditedModelName(name);
    setEditModalModelOpen(true);
  };

  const handleEditModalModelClose = () => {
    setEditModalModelOpen(false);
    setSelectedEditModel(null);
    setEditedModelName("");
  };

  const handleNameModelChange = (event) => {
    setEditedModelName(event.target.value);
  };

  const handleUpdateModelCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/model`, {
        id: selectedEditModel.id,
        name: editModelName,
      });
      console.log(response.data.message);
      const updatedModal = { ...selectedEditModel, name: editModelName };
      setModels(
        models.map((mod) =>
          mod.id === selectedEditModel.id ? updatedModal : mod
        )
      );
      notifySuccess(`Model updated successfully`);
      handleEditModalModelClose();
    } catch (error) {
      console.error("Error updating Model:", error);
      notifyError("Error updating Model");
    }
  };

  const handleModelDelete = async (id, name) => {
    try {
      const confrimdelete = window.confirm(
        `Are you sure you want to delete "${name}?"`
      );
      if (confrimdelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/model?id=${id}`
        );
        console.log(response.data.message);
        setModels(models.filter((mod) => mod.id !== id));
        notifySuccess(`Model "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting Model:", error);
      notifyError("Error deleting Model");
    }
  };

  // edit and delete color
  const handleColorEdit = (id, name) => {
    setSelectedEditColor({ id, name });
    setEditedColorName(name);
    setEditModalColorOpen(true);
  };

  const handleEditModalColorClose = () => {
    setEditModalColorOpen(false);
    setSelectedEditColor(null);
    setEditedColorName("");
  };

  const handleNameColorChange = (event) => {
    setEditedColorName(event.target.value);
  };
  const handleUpdateColorCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/color`, {
        id: selectedEditColor.id,
        name: editColorName,
      });
      console.log(response.data.message);
      const updatedColor = { ...selectedEditColor, name: editColorName };
      setColors(
        colors.map((col) =>
          col.id === selectedEditColor.id ? updatedColor : col
        )
      );
      notifySuccess(`Color updated successfully`);
      handleEditModalColorClose();
    } catch (error) {
      console.error("Error updating Color:", error);
      notifyError("Error updating Color");
    }
  };

  const handleColorDelete = async (id, name) => {
    try {
      const confrimdelete = window.confirm(
        `Are you sure you wnat to delete color "${name}"?`
      );
      if (confrimdelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/color?id=${id}`
        );
        console.log(response.data.message);
        setColors(colors.filter((col) => col.id !== id));
        notifySuccess(`Color "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting Color:", error);
      notifyError(`Color "${name}" deleted failed`);
    }
  };

  // edit and delete size
  const handleSizeEdit = (id, name) => {
    setSelectedEditSize({ id, name });
    setEditedSizeName(name);
    setEditModalSizeOpen(true);
  };

  const handleEditModalSizeClose = () => {
    setEditModalSizeOpen(false);
    setSelectedEditSize(null);
    setEditedSizeName("");
  };

  const handleNameSizeChange = (event) => {
    setEditedSizeName(event.target.value);
  };
  const handleUpdateSizeCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/size`, {
        id: selectedEditSize.id,
        name: editSizeName,
      });
      console.log(response.data.message);
      const updatedColor = { ...selectedEditSize, name: editSizeName };
      setSizes(
        sizes.map((col) =>
          col.id === selectedEditSize.id ? updatedColor : col
        )
      );
      notifySuccess(`Size updated successfully`);
      handleEditModalSizeClose();
    } catch (error) {
      console.error("Error updating Size:", error);
      notifyError("Error updating Size");
    }
  };

  const handleSizeDelete = async (id, name) => {
    try {
      const confrimDelete = window.confirm(
        `Are you sure you wnat to delete size "${name}"?`
      );
      if (confrimDelete) {
        const response = await requestApi(
          "DELETE",
          `/api/structure/size?id=${id}`
        );
        console.log(response.data.message);
        setSizes(sizes.filter((col) => col.id !== id));
        notifySuccess(`Color "${name}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting Size:", error);
      notifyError(`Size "${name}" deleted failed`);
    }
  };

  // CRUD Occasion
  const handleOccasionEdit = (id, name) => {
    setSelectedEditOccasion({ id, name });
    setEditedOccasionName(name);
    setEditModalOccasionOpen(true);
  };
  const handleEditModalOccasionClose = () => {
    setEditModalOccasionOpen(false);
    setSelectedEditOccasion(null);
    setEditedOccasionName("");
  };
  const handleUpdateOccasionCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/occasion`, { id: selectedEditOccasion.id, name: editOccasionName });
      const updated = { ...selectedEditOccasion, name: editOccasionName };
      setOccasions(occasions.map((o) => o.id === selectedEditOccasion.id ? updated : o));
      notifySuccess(`Occasion updated successfully`);
      handleEditModalOccasionClose();
    } catch (error) {
      notifyError("Error updating Occasion");
    }
  };
  const handleOccasionDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete occasion "${name}"?`)) {
      try {
        await requestApi("DELETE", `/api/structure/occasion?id=${id}`);
        setOccasions(occasions.filter((o) => o.id !== id));
        notifySuccess(`Occasion "${name}" deleted successfully`);
      } catch (error) {
        notifyError("Error deleting Occasion");
      }
    }
  };

  // CRUD Type
  const handleTypeEdit = (id, name) => {
    setSelectedEditType({ id, name });
    setEditedTypeName(name);
    setEditModalTypeOpen(true);
  };
  const handleEditModalTypeClose = () => {
    setEditModalTypeOpen(false);
    setSelectedEditType(null);
    setEditedTypeName("");
  };
  const handleUpdateTypeCategory = async () => {
    try {
      const response = await requestApi("PUT", `/api/structure/type`, { id: selectedEditType.id, name: editTypeName });
      const updated = { ...selectedEditType, name: editTypeName };
      setTypes(types.map((t) => t.id === selectedEditType.id ? updated : t));
      notifySuccess(`Type updated successfully`);
      handleEditModalTypeClose();
    } catch (error) {
      notifyError("Error updating Type");
    }
  };
  const handleTypeDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete type "${name}"?`)) {
      try {
        await requestApi("DELETE", `/api/structure/type?id=${id}`);
        setTypes(types.filter((t) => t.id !== id));
        notifySuccess(`Type "${name}" deleted successfully`);
      } catch (error) {
        notifyError("Error deleting Type");
      }
    }
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
              {selectedCategory ? null : (
                <h2 className="item-list-head">No Items Selected</h2>
              )}
              <div className="selected-info">
                {selectedCategory &&
                  (selectedCategory.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedCategory.image_path}
                      alt={selectedCategory.name}
                    />
                  ) : (
                    <p className="image-alt-text">{selectedCategory.name}</p>
                  ))}
                {selectedItemName &&
                  (selectedItemName.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedItemName.image_path}
                      alt={selectedItemName.name}
                    />
                  ) : (
                    <p className="image-alt-text">{selectedItemName.name}</p>
                  ))}
                {selectedSubCategory &&
                  (selectedSubCategory.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedSubCategory.image_path}
                      alt={selectedSubCategory.name}
                    />
                  ) : (
                    <p className="image-alt-text">{selectedSubCategory.name}</p>
                  ))}
                {selectedBrand &&
                  (selectedBrand.image_path !== "" ? (
                    <img
                      src={`${apiHost}/` + selectedBrand.image_path}
                      alt={selectedBrand.name}
                    />
                  ) : (
                    <p className="image-alt-text">{selectedBrand.name}</p>
                  ))}
                {selectedModel &&
                  (selectedModel.image_path !== "" ? (
                    <p className="image-alt-text">{selectedModel.name}</p>
                  ) : (
                    <p className="image-alt-text">{selectedModel.name}</p>
                  ))}
                {selectedColor &&
                  (selectedColor.image_path !== "" ? (
                    <p className="image-alt-text">{selectedColor.name}</p>
                  ) : (
                    <p className="image-alt-text">{selectedColor.name}</p>
                  ))}
              </div>
            </div>

            <div className="search-and-product-type-grid">
              <div className="search-container">
                <InputBox
                  label={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--text)",
                      }}
                    >
                      <SearchSharpIcon
                        sx={{ marginRight: 1, color: "var(--text)" }}
                      />
                      Search
                    </div>
                  }
                  size="small"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  sx={{ width: "100%" }}
                />
              </div>

              {isLoading && <div className="loader"></div>}
              {!isLoading && (
                <div className="card-container">
                  {/* Categories */}
                  {selectedCategory === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <h2>Select a Category</h2>
                        <AddBoxRoundedIcon
                          sx={{ fontSize: 35, color: "var(--button)" }}
                          className="add-icon"
                          onClick={handleCategoryOpen}
                        />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(categories).map((category) => (
                            <div key={category.id} className="c-cards">
                              <div className="item-card">
                                <div
                                  className="category-info"
                                  onClick={() => handleSelectCategory(category)}
                                >
                                  <div className="names">{category.name}</div>
                                  {category.image_path && (
                                    <img
                                      src={`${apiHost}/` + category.image_path}
                                      alt={category.name}
                                    />
                                  )}
                                </div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon">
                                      <EditIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleEdit(category.id, category.name)
                                        }
                                      />
                                    </div>
                                    <div className="edit-delete-icon">
                                      <DeleteIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleDelete(
                                            category.id,
                                            category.name
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal
                          open={editModalOpen}
                          onClose={handleEditModalClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div
                            style={{
                              position: "absolute",
                              width: "60%",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "var(--background-1)",
                              boxShadow: 24,
                              padding: "30px 60px",
                              display: "flex",
                              flexDirection: "column",
                              color: "var(--text)",
                              gap: "10px",
                            }}
                          >
                            <h2>Edit Category</h2>
                            <InputBox
                              label="Category Name"
                              value={editedName}
                              size="small"
                              sx={{ width: "100%" }}
                              onChange={handleNameChange}
                            />
                            <button
                              className="button-in-dialog"
                              variant="contained"
                              onClick={handleUpdateCategory}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}
                  {/* Item Names */}
                  {selectedCategory && selectedItemName === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon
                          sx={{ cursor: "pointer", color: "#178a84" }}
                          onClick={() => {
                            setSelectedCategory(null); 
                            setSelectedItemName(null);
                          }}
                        />
                        <h2>
                          <center>Item Name</center>
                        </h2>
                        <AddBoxRoundedIcon
                          sx={{ fontSize: 35, color: "var(--button)" }}
                          className="add-icon"
                          onClick={handleItemOpen}
                        />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(itemNames).map((itemName) => (
                            <div className="c-cards">
                              <div key={itemName.id} className="item-card">
                                <div
                                  className="category-info names"
                                  onClick={() => handleSelectItemName(itemName)}
                                >
                                  {itemName.name}
                                  {itemName.image_path && (
                                    <img
                                      src={`${apiHost}/` + itemName.image_path}
                                      alt={itemName.name}
                                    />
                                  )}
                                </div>

                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon">
                                      <EditIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleItemEdit(
                                            itemName.id,
                                            itemName.name
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="edit-delete-icon">
                                      <DeleteIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleDeleteItem(
                                            itemName.id,
                                            itemName.name
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal
                          open={editModalItemOpen}
                          onClose={handleEditItemModalClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "var(--background-1)",
                              boxShadow: 24,
                              padding: "30px 60px",
                              display: "flex",
                              flexDirection: "column",
                              color: "var(--text)",
                              gap: "10px",
                            }}
                          >
                            <h2>Edit Item Name</h2>
                            <InputBox
                              label="Category Name"
                              value={editedItemName}
                              size="small"
                              sx={{ width: "100%" }}
                              onChange={handleItemNameChange}
                            />
                            <button
                              variant="contained"
                              onClick={handleUpdateItem}
                              className="button-in-dialog"
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}

                  {/* Sub Categories */}
                  {selectedItemName && selectedSubCategory === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon
                          sx={{ cursor: "pointer", color: "#178a84" }}
                          onClick={() => {
                            setSelectedItemName(null);
                            setSelectedSubCategory(null); 
                          }}
                        />

                        <h2>
                          <center>Select a Sub-Category</center>
                        </h2>
                        <AddBoxRoundedIcon
                          sx={{ fontSize: 35, color: "var(--button)" }}
                          className="add-icon"
                          onClick={handleSubOpen}
                        />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(subCategories).map((subCategory) => (
                            <div key={subCategory.id} className="c-cards">
                              <div key={subCategory.id} className="item-card">
                                <div
                                  className="category-info names"
                                  onClick={() =>
                                    handleSelectSubCategory(subCategory)
                                  }
                                >
                                  {subCategory.name}
                                  {subCategory.image_path && (
                                    <img
                                      src={
                                        `${apiHost}/` + subCategory.image_path
                                      }
                                      alt={subCategory.name}
                                    />
                                  )}
                                </div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon">
                                      <EditIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleSubEdit(
                                            subCategory.id,
                                            subCategory.name
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="edit-delete-icon">
                                      <DeleteIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleSubDelete(
                                            subCategory.id,
                                            subCategory.name
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal
                          open={editModalSubOpen}
                          onClose={handleEditModalClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div
                            style={{
                              position: "absolute",
                              width: "60%",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "var(--background-1)",
                              boxShadow: 24,
                              padding: "30px 60px",
                              display: "flex",
                              flexDirection: "column",
                              color: "var(--text)",
                              gap: "10px",
                            }}
                          >
                            <h2>Edit Sub Category</h2>
                            <InputBox
                              label="SubCategory"
                              value={editSubName}
                              size="small"
                              sx={{ width: "100%" }}
                              onChange={handleSubNameChange}
                            />
                            <button
                              className="button-in-dialog"
                              onClick={handleUpdateSubCategory}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}

                  {/* Brands */}
                  {selectedSubCategory && selectedBrand === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon
                          sx={{ cursor: "pointer", color: "#178a84" }}
                          onClick={() => {
                            setSelectedSubCategory(null);
                            setSelectedBrand(null); 
                          }}
                        />

                        <h2>
                          <center>Select a Brand</center>
                        </h2>

                        <AddBoxRoundedIcon
                          sx={{ fontSize: 35, color: "var(--button)" }}
                          className="add-icon"
                          onClick={handleBrandOpen}
                        />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(brands).map((brand) => (
                            <div key={brand.id} className="c-cards">
                              <div className="item-card">
                                <div
                                  className="category-info names"
                                  onClick={() => handleSelectBrand(brand)}
                                >
                                  {brand.name}
                                  {brand.image_path && (
                                    <img
                                      src={`${apiHost}/` + brand.image_path}
                                      alt={brand.name}
                                    />
                                  )}
                                </div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon">
                                      <EditIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleBrandEdit(brand.id, brand.name)
                                        }
                                      />
                                    </div>
                                    <div className="edit-delete-icon">
                                      <DeleteIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleBrandDelete(
                                            brand.id,
                                            brand.name
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal
                          open={editModalBrandOpen}
                          onClose={handleEditModalBrandClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div
                            style={{
                              position: "absolute",
                              width: "60%",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "var(--background-1)",
                              boxShadow: 24,
                              padding: "30px 60px",
                              display: "flex",
                              flexDirection: "column",
                              color: "var(--text)",
                              gap: "10px",
                            }}
                          >
                            <h2>Edit Brand</h2>
                            <InputBox
                              label="Brand Name"
                              value={editBrandName}
                              size="small"
                              sx={{ width: "100%" }}
                              onChange={handleBrandNameChange}
                            />
                            <button
                              className="button-in-dialog"
                              onClick={handleUpdateBrandCategory}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}

                  {selectedBrand && selectedModel === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon
                          sx={{ cursor: "pointer", color: "#178a84" }}
                          onClick={() => {
                            setSelectedModel(null); 
                            setSelectedBrand(null); 
                          }}
                        />

                        <h2>
                          <center>Select a Model</center>
                        </h2>

                        <AddBoxRoundedIcon
                          sx={{ fontSize: 35, color: "var(--button)" }}
                          className="add-icon"
                          onClick={handleModelOpen}
                        />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(models).map((model) => (
                            <div key={model.id} className="c-cards">
                              <div className="item-card">
                                <div
                                  className="category-info names"
                                  onClick={() => handleSelectModel(model)}
                                >
                                  {model.name}
                                  {model.image_path && (
                                    <img
                                      src={`${apiHost}/` + model.image_path}
                                      alt={model.name}
                                    />
                                  )}
                                </div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon">
                                      <EditIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleModelEdit(model.id, model.name)
                                        }
                                      />
                                    </div>
                                    <div className="edit-delete-icon">
                                      <DeleteIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleModelDelete(
                                            model.id,
                                            model.name
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal
                          open={editModalModelOpen}
                          onClose={handleEditModalModelClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div
                            style={{
                              position: "absolute",
                              width: "60%",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "var(--background-1)",
                              boxShadow: 24,
                              padding: "30px 60px",
                              display: "flex",
                              flexDirection: "column",
                              color: "var(--text)",
                              gap: "10px",
                            }}
                          >
                            <h2>Edit Model</h2>
                            <InputBox
                              label="Brand Name"
                              value={editModelName}
                              size="small"
                              sx={{ width: "100%" }}
                              onChange={handleNameModelChange}
                            />
                            <button
                              className="button-in-dialog"
                              onClick={handleUpdateModelCategory}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}
                  {selectedModel && selectedColor === null && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon
                          sx={{ cursor: "pointer", color: "#178a84" }}
                          onClick={() => {
                            setSelectedModel(null); 
                            setSelectedColor(null);
                          }}
                        />

                        <h2>
                          <center>Select a Color</center>
                        </h2>

                        <AddBoxRoundedIcon
                          sx={{ fontSize: 35, color: "var(--button)" }}
                          className="add-icon"
                          onClick={handleColorOpen}
                        />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(colors).map((color) => (
                            <div key={color.id} className="c-cards">
                              <div className="item-card">
                                <div
                                  className="category-info names"
                                  onClick={() => handleSelectColor(color)}
                                >
                                  {color.name}
                                  {color.image_path && (
                                    <img
                                      src={`${apiHost}/` + color.image_path}
                                      alt={color.name}
                                    />
                                  )}
                                </div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon">
                                      <EditIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleColorEdit(color.id, color.name)
                                        }
                                      />
                                    </div>
                                    <div className="edit-delete-icon">
                                      <DeleteIcon
                                        style={{
                                          color: "#ffff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleColorDelete(
                                            color.id,
                                            color.name
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal
                          open={editModalColorOpen}
                          onClose={handleEditModalColorClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <div
                            style={{
                              position: "absolute",
                              width: "60%",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "var(--background-1)",
                              boxShadow: 24,
                              padding: "30px 60px",
                              display: "flex",
                              flexDirection: "column",
                              color: "var(--text)",
                              gap: "10px",
                            }}
                          >
                            <h2>Edit Color</h2>
                            <InputBox
                              label="Brand Name"
                              value={editColorName}
                              size="small"
                              sx={{ width: "100%" }}
                              onChange={handleNameColorChange}
                            />
                            <button
                              className="button-in-dialog"
                              onClick={handleUpdateColorCategory}
                            >
                              SUBMIT
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}

                  {showSizes && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon sx={{ cursor: "pointer", color: "#178a84" }} onClick={() => { setShowSizes(false); setSelectedColor(null); setSelectedSize(null); }} />
                        <h2><center>Select a Size</center></h2>
                        <AddBoxRoundedIcon sx={{ fontSize: 35, color: "var(--button)" }} className="add-icon" onClick={handleSizeOpen} />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(sizes).map((size) => (
                            <div key={size.id} className="c-cards">
                              <div className="item-card">
                                <div className="category-info names" onClick={() => handleSelectSize(size)}>{size.name}</div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon"><EditIcon style={{ color: "#ffff", cursor: "pointer" }} onClick={() => handleSizeEdit(size.id, size.name)} /></div>
                                    <div className="edit-delete-icon"><DeleteIcon style={{ color: "#ffff", cursor: "pointer" }} onClick={() => handleSizeDelete(size.id, size.name)} /></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Modal open={editModalSizeOpen} onClose={handleEditModalSizeClose}>
                          <div style={{ position: "absolute", width: "60%", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "var(--background-1)", boxShadow: 24, padding: "30px 60px", display: "flex", flexDirection: "column", color: "var(--text)", gap: "10px" }}>
                            <h2>Edit Size</h2>
                            <InputBox label="Size Name" value={editSizeName} size="small" sx={{ width: "100%" }} onChange={handleNameSizeChange} />
                            <button className="button-in-dialog" onClick={handleUpdateSizeCategory}>SUBMIT</button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  )}

                  {showOccasions && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon sx={{ cursor: "pointer", color: "#178a84" }} onClick={() => { setShowOccasions(false); setShowSizes(true); setSelectedSize(null); setSelectedOccasion(null); }} />
                        <h2><center>Select an Occasion</center></h2>
                        <AddBoxRoundedIcon sx={{ fontSize: 35, color: "var(--button)" }} className="add-icon" onClick={handleOccasionOpen} />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(occasions).map((occ) => (
                            <div key={occ.id} className="c-cards">
                              <div className="item-card">
                                <div className="category-info names" onClick={() => handleSelectOccasion(occ)}>{occ.name}</div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon"><EditIcon style={{ color: "#ffff", cursor: "pointer" }} onClick={() => handleOccasionEdit(occ.id, occ.name)} /></div>
                                    <div className="edit-delete-icon"><DeleteIcon style={{ color: "#ffff", cursor: "pointer" }} onClick={() => handleOccasionDelete(occ.id, occ.name)} /></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {showTypes && (
                    <div className="card1">
                      <div className="name-and-icon">
                        <ArrowBackIcon sx={{ cursor: "pointer", color: "#178a84" }} onClick={() => { setShowTypes(false); setShowOccasions(true); setSelectedOccasion(null); setSelectedType(null); }} />
                        <h2><center>Select a Type</center></h2>
                        <AddBoxRoundedIcon sx={{ fontSize: 35, color: "var(--button)" }} className="add-icon" onClick={handleTypeOpen} />
                      </div>
                      <div className="card">
                        <div className="flex-container">
                          {filterData(types).map((typ) => (
                            <div key={typ.id} className="c-cards">
                              <div className="item-card">
                                <div className="category-info names" onClick={() => handleSelectType(typ)}>{typ.name}</div>
                                <div className="edit-delete">
                                  <div className="ed-icon">
                                    <div className="edit-delete-icon"><EditIcon style={{ color: "#ffff", cursor: "pointer" }} onClick={() => handleTypeEdit(typ.id, typ.name)} /></div>
                                    <div className="edit-delete-icon"><DeleteIcon style={{ color: "#ffff", cursor: "pointer" }} onClick={() => handleTypeDelete(typ.id, typ.name)} /></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}


                  {showPricing && (
                    <div className="pricing-page">
                      <div className="pricing-header">
                        <ArrowBackIcon
                          sx={{ cursor: "pointer", color: "#178a84", fontSize: 28 }}
                          onClick={() => { setShowPricing(false); setShowTypes(true); setSelectedType(null); }}
                        />
                        <h2 className="pricing-title">Pricing Details</h2>
                        <div style={{ width: 28 }} />
                      </div>

                      <div className="pricing-card">
                        <div className="pricing-grid">
                          <div className="pricing-field">
                            <label className="pricing-label">S.No</label>
                            <InputBox type="number" id="bill" value={bill} size="small" sx={{ width: "100%" }} onChange={(e) => setBill(e.target.value)} required />
                          </div>
                          <div className="pricing-field">
                            <label className="pricing-label">Quantity</label>
                            <InputBox type="number" id="quantity" value={quantity} size="small" sx={{ width: "100%" }} onChange={(e) => setQuantity(e.target.value)} required />
                          </div>
                          <div className="pricing-field">
                            <label className="pricing-label">Selling Price</label>
                            <InputBox type="number" id="sellingprice" size="small" value={sellingprice} sx={{ width: "100%" }} onChange={handleSellingPriceChange} required />
                          </div>
                          <div className="pricing-field">
                            <label className="pricing-label">MRP</label>
                            <InputBox type="number" id="mrp" value={mrp} required sx={{ width: "100%" }} onChange={handleMrpPriceChange} size="small" />
                          </div>
                          <div className="pricing-field">
                            <label className="pricing-label">Purchase Price</label>
                            <InputBox type="number" id="purchaseprice" size="small" value={purchaseprice} sx={{ width: "100%" }} onChange={(e) => handleNumberChange(e, setPurchasePrice)} />
                          </div>
                        </div>

                        <div className="pricing-actions">
                          <button
                            className="action-btn action-btn--generate"
                            onClick={() => { handleGenerate(); handleNavigate("/productdashboard"); }}
                          >
                            ✚ Generate
                          </button>
                          <button
                            className="action-btn action-btn--other"
                            onClick={() => { handleGenerate(); handleRefresh(); }}
                          >
                            + Add other
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>      {/* category dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={categoryopen}
          onClose={handleCategoryClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleCategorySubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Category</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Category"
                placeholder="Select Category"
                value={categoryvalue}
                onChange={(val) => setCategoryValue(val)}
                options={masterCategories.map(cat => ({ value: cat.category_name, label: cat.category_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleCategoryClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* item-name dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={itemopen}
          onClose={handleItemClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleItemSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Item</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Item"
                placeholder="Select Item"
                value={itemvalue}
                onChange={(val) => setItemValue(val)}
                options={masterItemNames.map(i => ({ value: i.item_name, label: i.item_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleItemClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* sub-category dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={subopen}
          onClose={handleSubClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleSubSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Sub-Category</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Sub-Category"
                placeholder="Select Sub-Category"
                value={subvalue}
                onChange={(val) => setSubValue(val)}
                options={masterSubCategories.map(s => ({ value: s.sub_category_name, label: s.sub_category_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleSubClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* brand dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={brandopen}
          onClose={handleBrandClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleBrandSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Brand</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Brand"
                placeholder="Select Brand"
                value={brandvalue}
                onChange={(val) => setBrandValue(val)}
                options={masterBrands.map(b => ({ value: b.brand_name, label: b.brand_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleBrandClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* model dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={modelopen}
          onClose={handleModelClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleModelSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Model</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Model"
                placeholder="Select Model"
                value={modelvalue}
                onChange={(val) => setModelValue(val)}
                options={masterModels.map(m => ({ value: m.model_name, label: m.model_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleModelClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* color dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={coloropen}
          onClose={handleColorClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleColorSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Color</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Color"
                placeholder="Select Color"
                value={colorvalue}
                onChange={(val) => setColorValue(val)}
                options={masterColors.map(c => ({ value: c.color_name, label: c.color_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleColorClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* size dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={sizeopen}
          onClose={handleSizeClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleSizeSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Size</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Size"
                placeholder="Select Size"
                value={sizevalue}
                onChange={(val) => setSizeValue(val)}
                options={masterSizes.map(s => ({ value: s.size_name, label: s.size_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleSizeClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* occasion dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={occasionopen}
          onClose={handleOccasionClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleOccasionSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Occasion</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Occasion"
                placeholder="Select Occasion"
                value={occasionvalue}
                onChange={(val) => setOccasionValue(val)}
                options={masterOccasions.map(o => ({ value: o.occasion_name, label: o.occasion_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleOccasionClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* type dialog */}
      <div>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={typeopen}
          onClose={handleTypeClose}
          PaperProps={{
            style: {
              padding: "16px 24px",
              backgroundColor: "var(--background-1)",
              borderRadius: "12px",
            },
          }}
        >
          <form onSubmit={handleTypeSubmit} style={{ width: "100%" }}>
            <DialogTitle style={{ textAlign: "center", color: "var(--text)", padding: "10px 0" }}>
              <h2 style={{ margin: 0 }}>Add Type</h2>
            </DialogTitle>
            <DialogContent style={{ padding: "8px 0" }}>
              <CustomEditSelect
                label="Select Type"
                placeholder="Select Type"
                value={typevalue}
                onChange={(val) => setTypeValue(val)}
                options={masterTypes.map(t => ({ value: t.type_name, label: t.type_name }))}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button className="add-button-dialog" onClick={handleTypeClose} type="button">CANCEL</button>
                <button className="add-button-dialog" type="submit">ADD</button>
              </div>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* Occasion Edit Modal */}
      <Modal open={editModalOccasionOpen} onClose={handleEditModalOccasionClose}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, backgroundColor: "var(--background-1)", border: "2px solid #000", boxShadow: 24, padding: "20px", borderRadius: "10px" }}>
          <h2 style={{ textAlign: "center", color: "var(--text)", marginBottom: "20px" }}>Edit Occasion</h2>
          <InputBox label="Edit Occasion Name" value={editOccasionName} onChange={(e) => setEditedOccasionName(e.target.value)} size="small" fullWidth />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button className="add-button-dialog" onClick={handleUpdateOccasionCategory}>UPDATE</button>
            <button className="add-button-dialog" onClick={handleEditModalOccasionClose} style={{ marginLeft: "10px" }} type="button">CANCEL</button>
          </div>
        </div>
      </Modal>

      {/* Type Edit Modal */}
      <Modal open={editModalTypeOpen} onClose={handleEditModalTypeClose}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, backgroundColor: "var(--background-1)", border: "2px solid #000", boxShadow: 24, padding: "20px", borderRadius: "10px" }}>
          <h2 style={{ textAlign: "center", color: "var(--text)", marginBottom: "20px" }}>Edit Type</h2>
          <InputBox label="Edit Type Name" value={editTypeName} onChange={(e) => setEditedTypeName(e.target.value)} size="small" fullWidth />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button className="add-button-dialog" onClick={handleUpdateTypeCategory}>UPDATE</button>
            <button className="add-button-dialog" onClick={handleEditModalTypeClose} style={{ marginLeft: "10px" }} type="button">CANCEL</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddStocks;
