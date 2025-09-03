import React, { useCallback, useEffect, useState } from "react";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import {
  createNews,
  deleteNews,
  getAllNews,
  updateNews,
} from "../../../service/api/hrConfig/newsConfig";
import { Toaster } from "../../../common/alertComponets/Toaster";

const defaultFormData = {
  news: "",
};
const defaultErrors = {
  news: "",
};
function NewsConfig() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const configureFormData = () => [
    {
      label: "News",
      name: "news",
      type: "textarea",
      maxLength: "500",
      value: formData.news,
      error: errors.news,
      required: true,
    },
  ];
  const headers = ["News", "Action"];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...defaultErrors, [e.target.name]: "" });
  };
  const contentConfig = useCallback(
    () => ({
      actions: {
        edit: true,
        delete: true,
        view: false,
      },
      content: data?.map((content) => {
        return [
          {
            forAction: false,
            isPrint: true,
            value: content.news,
          },
          {
            forAction: true,
            isPrint: false,
            value: { ...content },
          },
        ];
      }),
    }),
    [data]
  );
  const editData = (item) => {
    setFormData(item);
  };
  const deleteData = (item) => {
    deleteNews(item.newsId)
      .then(() => {
        Toaster("error", "News deleted successfully");
        fetchData();
      })
      .catch((error) => console.log(error));
  };
  const actionClick = (event, item) => {
    switch (event) {
      case "edit":
        editData(item);
        break;
      case "delete":
        deleteData(item);
        break;
      default:
        break;
    }
  };
  const validate = () => {
    let isValid = true;
    setErrors({ ...defaultErrors });
    if (!formData.news) {
      setErrors({ ...errors, news: "News is required" });
      isValid = false;
    }
    return isValid;
  };
  const handleSubmit = useCallback(() => {
    if (!validate()) {
      Toaster("error", "Please fill all mandatory fields");
      return;
    }
    if (formData?.newsId) {
      // update
      updateNews(formData.newsId, formData)
        .then(() => {
          setFormData(defaultFormData);
          Toaster("success", "News updated successfully");
          fetchData();
        })
        .catch((error) => console.log(error));
    } else {
      // create
      createNews(formData)
        .then(() => {
          setFormData(defaultFormData);
          Toaster("success", "News created successfully");
          fetchData();
        })
        .catch((error) => console.log(error));
    }
  }, [formData]);
  const fetchData = () => {
    getAllNews()
      .then((res) => {
        setData(res);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <ConfigureForm
        data={configureFormData()}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        resetButton={() => {
          setFormData(defaultFormData);
          setErrors(defaultErrors);
        }}
      />
      <ConfigTable
        data={contentConfig()}
        headers={headers}
        actions={actionClick}
      />
    </>
  );
}

export default NewsConfig;
