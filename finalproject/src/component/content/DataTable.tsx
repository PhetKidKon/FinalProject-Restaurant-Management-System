import React, { useState  } from "react";
import { UpdateAccount, UpdateTable, UpdateIngredient, UpdateIngredientStock , UpdateMenu, OrderCustomerDetail, UpdateOrderStatus
  , ReservationCustomerDetail, UpdateReservationStatus, AddStock, UpdateIngrMenu, UpdateReadyMadeStock, DecreaseIngredientStock, 
  DecreaseReadyMadeMenuStock, BillCustomerDetail} from "./EditPopup";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import axios from "axios";


//Account Table

export function AccountTable ( {data, fetchdata, setAlert, setAlertMessage} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const emails =  data.map(item => item.account?.email).filter((email): email is string => typeof email === 'string');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">ID</th>
            <th scope="col" className="px-4 py-2">First Name</th>
            <th scope="col" className="px-4 py-2">Last Name</th>
            <th scope="col" className="px-4 py-2">Phone</th>
            <th scope="col" className="px-4 py-2">Email</th>
            <th scope="col" className="px-4 py-2">Role</th>
            <th scope="col" className="px-4 py-2">Status</th>
            <th scope="col" className="px-4 py-2">Update/Delete</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">{item.fname ?? "N/A"}</td>
              <td className="px-4 py-3">{item.lname ?? "N/A"}</td>
              <td className="px-4 py-3">{item.phone ?? "N/A"}</td>
              <td className="px-4 py-3">{item.account?.email ?? "N/A"}</td>
              <td className="px-4 py-3">{item.role}</td>
              <td className="px-4 py-3">
                {item.account?.status == "active" ? (
                  <span className="text-green-400">Active</span>
                ) : item.account?.status == "inactive" ? (
                  <span className="text-red-400">Inactive</span>
                ) : <span className="">N/A</span>}
              </td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup(true);
                  }}>
                  Update/Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { showPopup && createPortal(
        <UpdateAccount trigger={showPopup} setTrigger={setShowPopup} data={selectedData} emails={emails} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
        </UpdateAccount>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

//ResaurantTable Table

export function ResaurantTable ( {data, fetchdata, setAlert, setAlertMessage} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const tables_name =  data.map(item => item.table_name).filter((table_name): table_name is string => typeof table_name === 'string');

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">ID</th>
            <th scope="col" className="px-4 py-2">Table Name</th>
            <th scope="col" className="px-4 py-2">Capacity</th>
            <th scope="col" className="px-4 py-2">Status</th>
            <th scope="col" className="px-4 py-2">Created By</th>
            <th scope="col" className="px-4 py-2">Created_at</th>
            <th scope="col" className="px-4 py-2">Update/Delete</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">{item.table_name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.capacity ?? "N/A"}</td>
              <td className="px-4 py-3">{item.status == "available" ? <div className="text-green-400">{item.status}</div> 
                                                                            :  item.status == "occupied" ? <div className="text-blue-400">{item.status}</div>
                                                                            : <div className="text-red-400">{item.status}</div>
                                        }
              </td>
              <td className="px-4 py-3">{item.created_by?.account?.email ?? "N/A"}</td>
              <td className="px-4 py-3">{item.day}/{item.month}/{item.year}</td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup(true);
                  }}>
                  Update/Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { showPopup && createPortal(
        <UpdateTable trigger={showPopup} setTrigger={setShowPopup} data={selectedData} tables_name={tables_name} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
        </UpdateTable>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

//Ingredient Table

export function IngredientTable ( {data, fetchdata, setAlert, setAlertMessage, role} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const ingrs_name =  data.map(item => item.name).filter((name): name is string => typeof name === 'string');

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">name</th>
            <th scope="col" className="px-4 py-2">type</th>
            <th scope="col" className="px-4 py-2">unit</th>
            <th scope="col" className="px-4 py-2">available Stock</th>
            <th scope="col" className="px-4 py-2">account name</th>
            <th scope="col" className="px-4 py-2">created_at</th>
            <th scope="col" className="px-4 py-2">stock</th>
            <th scope="col" className="px-4 py-2">Update/Delete</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">{item.name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.type ?? "N/A"}</td>
              <td className="px-4 py-3">{item.unit ?? "N/A"}</td>
              <td className="px-4 py-3">{item.availableStockQty !== 0 ? <div className="text-green-400">{item.availableStockQty}</div> 
                                                                            : <div className="text-red-400">{item.availableStockQty}</div>}</td>
              <td className="px-4 py-3">{item.created_by?.account?.email ?? "N/A"}</td>
              <td className="px-4 py-3">{item.day}/{item.month}/{item.year}</td>
              <td className=" py-3">
                <Link to={role === "SystemAdmin" ? '/systemadmin/ingredient/'+item.id : '/inventorysupervisor/ingredient/'+item.id}> 
                  <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                    onClick={() => {}}>
                    Details
                  </button>
                </Link>
              </td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup(true);
                  }}>
                  Update/Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { showPopup && createPortal(
        <UpdateIngredient trigger={showPopup} setTrigger={setShowPopup} data={selectedData} ingrs_name={ingrs_name} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
        </UpdateIngredient>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

export function IngredientStockTable ( {data, stockData, fetchdata, setAlert, setAlertMessage, role, email} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId ,setSelectedId] = useState<number>(0);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(stockData.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = stockData.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">stock id</th>
            <th scope="col" className="px-4 py-2">name</th>
            <th scope="col" className="px-4 py-2">quantity</th>
            <th scope="col" className="px-4 py-2">unit</th>
            <th scope="col" className="px-4 py-2">expired</th>
            <th scope="col" className="px-4 py-2">email</th>
            <th scope="col" className="px-4 py-2">{role === "ROLE_SYSTEMADMIN" ? "Update/Delete" : "Decrease"}</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.stock_id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.stock_id ?? "N/A"}</td>
              <td className="px-4 py-3">{data.name ?? "N/A"}</td>
              <td className="px-4 py-3">
                {
                  (() => {
                    if (!item.expired_date) return "N/A";
                    const parts = item.expired_date.includes('-')
                      ? item.expired_date.split('-')
                      : item.expired_date.split('/');
                    let [d, m, y] = parts.map(Number);
                    const expiredYearBE = y < 2500 ? y + 543 : y;
                    const today = new Date();
                    const todayBE = today.getFullYear() + 543;
                    const todayMonth = today.getMonth() + 1;
                    const todayDate = today.getDate();
                    if (
                      expiredYearBE < todayBE ||
                      (expiredYearBE === todayBE && (m < todayMonth || (m === todayMonth && d < todayDate)))
                    ) {
                      return <span className="text-red-500">{item.qty}</span>;
                    }
                    return <span className="text-green-500">{item.qty}</span>;
                  })()
                }
                </td>
              <td className="px-4 py-3">{data.unit ?? "N/A"}</td>
              <td className="px-4 py-3">
                {
                  (() => {
                    if (!item.expired_date) return "N/A";
                    const parts = item.expired_date.includes('-')
                      ? item.expired_date.split('-')
                      : item.expired_date.split('/');
                    let [d, m, y] = parts.map(Number);
                    const expiredYearBE = y < 2500 ? y + 543 : y;
                    const today = new Date();
                    const todayBE = today.getFullYear() + 543;
                    const todayMonth = today.getMonth() + 1;
                    const todayDate = today.getDate();
                    if (
                      expiredYearBE < todayBE ||
                      (expiredYearBE === todayBE && (m < todayMonth || (m === todayMonth && d < todayDate)))
                    ) {
                      return <span className="text-red-500">{item.expired_date}</span>;
                    }
                    return <span className="text-green-500">{item.expired_date}</span>;
                  })()
                }
              </td>
              <td className="px-4 py-3">{data.account_email ?? "N/A"}</td>
              <td className=" py-3">
                {role === "ROLE_SYSTEMADMIN" ? <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup(true);
                    setSelectedId(data.id);
                  }}>
                  Update/Delete
                </button> : <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup2(true);
                    setSelectedId(data.id);
                  }}>
                  Decrease
                </button>}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { showPopup && createPortal(
        <UpdateIngredientStock trigger={showPopup} setTrigger={setShowPopup} data={selectedData} ingr_id={selectedId} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage} email={email}>
        </UpdateIngredientStock>, document.body
        )
      } 

      { showPopup2 && createPortal(
        <DecreaseIngredientStock trigger={showPopup2} setTrigger={setShowPopup2} data={selectedData} ingr_id={selectedId} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage} email={email}>
        </DecreaseIngredientStock>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

//Transaction Table

export function TransactionTable ( {data, fetchdata, setAlert, setAlertMessage} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">product type</th>
            <th scope="col" className="px-4 py-2">product id</th>
            <th scope="col" className="px-4 py-2">product name</th>
            <th scope="col" className="px-4 py-2">transaction type</th>
            <th scope="col" className="px-4 py-2">quantity</th>
            <th scope="col" className="px-4 py-2">description</th>
            <th scope="col" className="px-4 py-2">expired date</th>
            <th scope="col" className="px-4 py-2">email</th>
            <th scope="col" className="px-4 py-2">created date</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-5">{item.id}</td>
              <td className="px-4 py-5">{item.product_type ?? "N/A"}</td>
              <td className="px-4 py-5">{item.product_id ?? "N/A"}</td>
              <td className="px-4 py-5">{item.product_name ?? "N/A"}</td>
              <td className="px-4 py-5">{item.transaction_type == "inbound" ? <div className="text-green-500">{item.transaction_type}</div>
                                                                            : item.transaction_type == "updated" ? <div className="text-blue-500">{item.transaction_type}</div> 
                                                                            : <div className="text-red-400">{item.transaction_type}</div>}
              </td>
              <td className="px-4 py-5">{item.transaction_type == "inbound" ? <div className="text-green-500">{item.qty}</div>
                                                                            : item.transaction_type == "updated" ? <div className="text-blue-500">{item.qty}</div>
                                                                            : <div className="text-red-400">{item.qty}</div>}
              </td>
              <td className="px-4 py-5">{item.description ?? "N/A"}</td>
              <td className="px-4 py-5">{item.expried_date ?? "N/A"}</td>
              <td className="px-4 py-5">{item.account_email ?? "N/A"}</td>
              <td className="px-4 py-5">{item.create_date ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

//MenuItem

export function MenuTable ( {data, fetchdata, setAlert, setAlertMessage, role} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [imgPopup, setImgPopup] = useState(false);
  const [updateimgPopup, setUpdateImgPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedImg, setSelectedImg] = useState("");

  const [imgFile, setImgFile] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const menus_name =  data.map(item => item.name).filter((name): name is string => typeof name === 'string');

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setImgFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Files Must be an image");
      }
  };

  const handleUpdateImage = async () => {
    if (!imgFile) {
      alert("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imgFile);

    try {
      const res = await axios.post(
        `http://localhost:3001/api/menu/${selectedId}/updateimg`,
        formData
        // ไม่ต้องใส่ headers: Content-Type
      );

      let responseData;
      if (typeof res.data === "string") {
        try {
          responseData = JSON.parse(res.data);
        } catch (parseError) {
          responseData = { message: res.data };
        }
      } else {
        responseData = res.data;
      }

      setAlertMessage(responseData.message ?? "Update image successful");
      setAlert(true);

        } catch (error) {
            console.error("Error Update image:", error);

            if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;

                if (typeof errorData === "string") {
                    try {
                        const parsedData = JSON.parse(errorData);
                        setAlertMessage(parsedData.message || `Error ${statusCode}`);
                    } catch (parseError) {
                        setAlertMessage(errorData || `Error ${statusCode}`);
                    }
                } else {
                    setAlertMessage(errorData.message || `Error ${statusCode}`);
                }
            } else {
                setAlertMessage("An error occurred");
            }

            setAlert(true);
        }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">name</th>
            <th scope="col" className="px-4 py-2">category name</th>
            <th scope="col" className="px-4 py-2">price</th>
            <th scope="col" className="px-4 py-2">unit</th>
            <th scope="col" className="px-4 py-2">status</th>
            <th scope="col" className="px-4 py-2">available stock</th>
            <th scope="col" className="px-4 py-2">description</th>
            <th scope="col" className="px-4 py-2">email</th>
            <th scope="col" className="px-4 py-2">created_at</th>
            <th scope="col" className="px-4 py-2">image</th>
            <th scope="col" className="px-4 py-2">Menu Type</th>
            <th scope="col" className="px-4 py-2">stock/ingredient used</th>
            <th scope="col" className="px-4 py-2">Update/Delete</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">{item.name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.category_name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.price ?? "N/A"}</td>
              <td className="px-4 py-3">{item.unit ?? "N/A"}</td>
              <td className="px-4 py-3">{item.status == "available" ? <div className="text-green-400">{item.status}</div> 
                                                                            : <div className="text-red-400">{item.status}</div>}</td>
              <td className="px-4 py-3">{item.available_stock_qty !== 0 ? <div className="text-green-400">{item.available_stock_qty}</div> 
                                                                            : <div className="text-red-400">{item.available_stock_qty}</div>}</td>
              <td className="px-4 py-3">{item.description ?? "N/A"}</td>
              <td className="px-4 py-3">{item.account_email}</td>
              <td className="px-4 py-3">{item.create_date}</td>
              <td className="px-4 py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                  onClick={() => {
                    setSelectedId(item.id);
                    setSelectedImg("http://localhost:3001/api/menu/"+item.id+"/imgFile")
                    setImgPopup(true);
                  }}>
                  Show
                </button>
              </td>
              <td className="px-4 py-3">{
                  item.menu_type.toLowerCase() === "readymademenu".toLowerCase() ? "สำเร็จรูป"
                  : "ใช้วัตถุดิบ"
                }</td>
              <td className=" py-3">
                { item.menu_type.toLowerCase() === "readymademenu".toLowerCase() ? 
                  <Link to={role === "SystemAdmin" ? '/systemadmin/menu/readymade/'+item.id : '/inventorysupervisor/menu/readymade/'+item.id}>
                    <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                      onClick={() => {}}>
                      Details
                    </button>
                  </Link>
                  : <Link to={role === "SystemAdmin" ? '/systemadmin/menu/ingrbase/'+item.id : '/inventorysupervisor/menu/ingrbase/'+item.id}>
                  <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                    onClick={() => {}}>
                    Details
                  </button>
                </Link>
                }
              </td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup(true);
                  }}>
                  Update/Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { showPopup && createPortal(
        <UpdateMenu trigger={showPopup} setTrigger={setShowPopup} data={selectedData} menu_name={menus_name} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
        </UpdateMenu>, document.body
        )
      }
      { imgPopup && createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                <div className="text-lg space-y-10 flex flex-col items-center justify-center py-5">
                    <label className="font-bold text-stone-800">Menu : {selectedId}</label>
                    <img className="h-48 w-72 object-contain" src={selectedImg} alt="" />
                    <div className="flex flex-row gap-x-10">
                      <button className="py-1 px-4 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                onClick={() => {
                                  setImgPopup(false)
                                  setSelectedImg("")
                                  setUpdateImgPopup(true)
                                }}>
                                  Update Image
                      </button>
                      <button className="py-1 px-4 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white"
                                onClick={() => {
                                  setImgPopup(false)
                                  setSelectedImg("")
                                }}>
                                  Close
                      </button>
                    </div>
                </div>
            </div>
        </div>, document.body
      )
      }
      

      { updateimgPopup && createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white px-5 py-8 rounded-lg shadow-lg w-1/3">
                <div className="text-lg space-y-10 flex flex-col items-center justify-center py-5">
                    <label className="font-bold text-stone-800">Menu : {selectedId}</label>

                    { imagePreview ? 
                      <img src={imagePreview} alt="Upload" className="h-48 w-72 object-contain"/>
                      : <img src="https://via.placeholder.com/150" alt="No Image Chosen" className="h-48 w-72 object-cover bg-gray-100 rounded-lg border-2 border-stone-500" />
                    }

                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm py-1 px-2 rounded-md bg-gray-200 border-2 border-stone-500 
                      cursor-pointer h-8 w-50" />

                    <div className="flex flex-row gap-x-10">
                      <button className="py-1 px-4 rounded-xl bg-emerald-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                hover:bg-emerald-600 hover:text-white hover:shadow-lg active:bg-emerald-700 active:text-white"
                                onClick={() => {
                                  handleUpdateImage()
                                  setUpdateImgPopup(false)
                                  setSelectedImg("")
                                  setSelectedId(0);
                                  setImgFile(null);
                                }}>
                                  Update New Image
                      </button>
                      <button className="py-1 px-4 rounded-xl bg-red-500 border-2 border-stone-800 transition-[box-shadow_background-color_color]
                                hover:bg-red-600 hover:text-white hover:shadow-lg active:bg-red-700 active:text-white"
                                onClick={() => {
                                  setUpdateImgPopup(false)
                                  setImagePreview(null);
                                }}>
                                  Cancel
                      </button>
                    </div>
                </div>
            </div>
        </div>, document.body
      )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

export function ReadyMadeMenuStockTable ( {data, stockdata, fetchdata, setAlert, setAlertMessage, email, role} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState<number>(0);
  
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(stockdata.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = stockdata.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">stock id</th>
            <th scope="col" className="px-4 py-2">name</th>
            <th scope="col" className="px-4 py-2">quantity</th>
            <th scope="col" className="px-4 py-2">unit</th>
            <th scope="col" className="px-4 py-2">expired_date</th>
            <th scope="col" className="px-4 py-2">email</th>
            <th scope="col" className="px-4 py-2">{role === "ROLE_SYSTEMADMIN" ? "Update/Delete" : "Decrease"}</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.stock_id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.stock_id ?? "N/A"}</td>
              <td className="px-4 py-3">{data.name ?? "N/A"}</td>
              <td className="px-4 py-3">
                {
                  (() => {
                    if (!item.expired_date) return "N/A";
                    const parts = item.expired_date.includes('-')
                      ? item.expired_date.split('-')
                      : item.expired_date.split('/');
                    let [d, m, y] = parts.map(Number);
                    const expiredYearBE = y < 2500 ? y + 543 : y;
                    const today = new Date();
                    const todayBE = today.getFullYear() + 543;
                    const todayMonth = today.getMonth() + 1;
                    const todayDate = today.getDate();
                    if (
                      expiredYearBE < todayBE ||
                      (expiredYearBE === todayBE && (m < todayMonth || (m === todayMonth && d < todayDate)))
                    ) {
                      return <span className="text-red-500">{item.qty}</span>;
                    }
                    return <span className="text-green-500">{item.qty}</span>;
                  })()
                } 
                </td>
              <td className="px-4 py-3">{data.unit ?? "N/A"}</td>
              <td className="px-4 py-3">
                {
                  (() => {
                    if (!item.expired_date) return "N/A";
                    const parts = item.expired_date.includes('-')
                      ? item.expired_date.split('-')
                      : item.expired_date.split('/');
                    let [d, m, y] = parts.map(Number);
                    const expiredYearBE = y < 2500 ? y + 543 : y;
                    const today = new Date();
                    const todayBE = today.getFullYear() + 543;
                    const todayMonth = today.getMonth() + 1;
                    const todayDate = today.getDate();
                    if (
                      expiredYearBE < todayBE ||
                      (expiredYearBE === todayBE && (m < todayMonth || (m === todayMonth && d < todayDate)))
                    ) {
                      return <span className="text-red-500">{item.expired_date}</span>;
                    }
                    return <span className="text-green-500">{item.expired_date}</span>;
                  })()
                }
              </td>
              <td className="px-4 py-3">{data.account_email ?? "N/A"}</td>
              <td className=" py-3">
                {role === "ROLE_SYSTEMADMIN" ? <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup(true);
                    setSelectedId(data.id);
                  }}>
                  Update/Delete
                </button> : <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                  onClick={() => {
                    setSelectedData(item);
                    setShowPopup2(true);
                    setSelectedId(data.id);
                  }}>
                  Decrease
                </button>}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { showPopup && createPortal(
        <UpdateReadyMadeStock trigger={showPopup} setTrigger={setShowPopup} data={selectedData} menu_id={selectedId} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage} email={email}>
        </UpdateReadyMadeStock>, document.body
        )
      }

      { showPopup2 && createPortal(
        <DecreaseReadyMadeMenuStock trigger={showPopup2} setTrigger={setShowPopup2} data={selectedData} menu_id={selectedId} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage} email={email}>
        </DecreaseReadyMadeMenuStock>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

export function IngredientbaseStockTable ( {data, stockdata, fetchdata, setAlert, setAlertMessage, role, email} ) {

  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedIngredientId, setSelectedIngredientId] = useState<number>(0);
  const [AddStockPopup, setAddStockPopup] = useState(false);
  
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(stockdata.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = stockdata.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            
            <th scope="col" className="px-4 py-2">ingredient id</th>
            <th scope="col" className="px-4 py-2">ingredient name</th>
            <th scope="col" className="px-4 py-2">quantity used</th>
            <th scope="col" className="px-4 py-2">available stock</th>
            {
              role === "inventorysupervisor" && <th scope="col" className="px-4 py-2">add stock</th>
            }
            <th scope="col" className="px-4 py-2">email</th>
            <th scope="col" className="px-4 py-2">Update/Delete</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.menuingr_id} className="border-t border-gray-600">
              
              <td className="px-4 py-3">{item.ingredient_id ?? "N/A"}</td>
              <td className="px-4 py-3">{item.ingredient_name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.qty ?? "N/A"}</td>
              <td className="px-4 py-3">{item.available_stock_qty !== 0 ? <div className="text-green-400">{item.available_stock_qty}</div> 
                                                                            : <div className="text-red-400">{item.available_stock_qty}</div>}</td>
              {
                role === "inventorysupervisor" && <td className=" py-3">
                 <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                    onClick={() => {
                      setAddStockPopup(true);
                      setSelectedIngredientId(item.ingredient_id);
                    }}>
                    Add Stock
                  </button>
              </td>
              }                                                              
              <td className="px-4 py-3">{data.account_email ?? "N/A"}</td>
              <td className=" py-3">
                 <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-red-400 hover:bg-red-500"
                    onClick={() => {
                      setSelectedData(item);
                      setShowPopup(true);
                      setSelectedId(data.id);
                    }}>
                    Update/Delete
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      { AddStockPopup && createPortal(
            <AddStock trigger={AddStockPopup} setTrigger={setAddStockPopup} fetchData={fetchdata} product_type={"ingredient"} product_id={selectedIngredientId} setAlert={setAlert} email={email} setAlertMessage={setAlertMessage}>
          </AddStock>, document.body
        )
      }

      { showPopup && createPortal(
        <UpdateIngrMenu trigger={showPopup} setTrigger={setShowPopup} data={selectedData} menu_id={data.id} menu_name={data.name} fetchData={fetchdata} setAlert={setAlert} setAlertMessage={setAlertMessage}>
        </UpdateIngrMenu>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

//Order

export function OrderTable ( {data, fetchdata, setAlert, setAlertMessage} ) {

  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">table name</th>
            <th scope="col" className="px-4 py-2">reserve id</th>
            <th scope="col" className="px-4 py-2">Customer Role</th>
            <th scope="col" className="px-4 py-2">customer details</th>
            <th scope="col" className="px-4 py-2">status</th>
            <th scope="col" className="px-4 py-2">total price</th>
            <th scope="col" className="px-4 py-2">cashier</th>
            <th scope="col" className="px-4 py-2">created_at</th>
            <th scope="col" className="px-4 py-2">OrderItems</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.order_id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.order_id}</td>
              <td className="px-4 py-3">{item.table_name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.reserve_id ?? "N/A"}</td>
              <td className="px-4 py-3">{item.customer_role ?? "N/A"}</td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                  onClick={() => { 
                    setSelectedData(item);
                    setShowCustomerDetail(true);
                   }}>
                  Details
                </button>
              </td>
              <td className="px-4 py-3">{item.status == "completed" ? <div className="text-green-400">{item.status}</div> 
                                                                            : item.status == "received" ? <div className="text-blue-600">{item.status}</div>
                                                                            : <div className="text-red-400">{item.status}</div>}</td>
              <td className="px-4 py-3">{item.total_price ?? "N/A"}</td>
              <td className="px-4 py-3">{item.cashier_email ?? "N/A"}</td>
              <td className="px-4 py-3">{item.created_date}</td>
              <td className=" py-3">
                <Link to={'/systemadmin/order/'+item.order_id}> 
                  <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                    onClick={() => {}}>
                    Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {
        showCustomerDetail && createPortal(
          <OrderCustomerDetail trigger={showCustomerDetail} setTrigger={setShowCustomerDetail} order={selectedData}></OrderCustomerDetail>, document.body
        )
      }

      {
        showPopup && createPortal( 
          <UpdateOrderStatus trigger={showPopup} setTrigger={setShowPopup} setAlert={setAlert} setAlertMessage={setAlertMessage} fetchData={fetchdata} order={selectedData}></UpdateOrderStatus>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

export function OrderItemTable ( {data} ) {

  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">menu name</th>
            <th scope="col" className="px-4 py-2">unit</th>
            <th scope="col" className="px-4 py-2">quantity</th>
            <th scope="col" className="px-4 py-2">price per item</th>
            <th scope="col" className="px-4 py-2">total price</th>
            <th scope="col" className="px-4 py-2">comment</th>
            <th scope="col" className="px-4 py-2">created_at</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.orderitem_id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.orderitem_id}</td>
              <td className="px-4 py-3">{item.name ?? "N/A"}</td>
              <td className="px-4 py-3">{item.unit ?? "N/A"}</td>
              <td className="px-4 py-3">{item.qty ?? "N/A"}</td>
              <td className="px-4 py-3">{item.priceperitem ?? "N/A"}</td>
              <td className="px-4 py-3">{item.total_price ?? "N/A"}</td>
              <td className="px-4 py-3">{item.comment ?? "N/A"}</td>
              <td className="px-4 py-3">{item.created_date ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

//Reservation Table


export function ReservationTable ( {data, fetchdata, setAlert, setAlertMessage} ) {

  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null); 
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">Customer Role</th>
            <th scope="col" className="px-4 py-2">customer details</th>
            <th scope="col" className="px-4 py-2">status</th>
            <th scope="col" className="px-4 py-2">people count</th>
            <th scope="col" className="px-4 py-2">checkin date</th>
            <th scope="col" className="px-4 py-2">created at</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">{item.customer?.role ?? "N/A"}</td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                  onClick={() => { 
                    setSelectedData(item);
                    setShowCustomerDetail(true);
                   }}>
                  Details
                </button>
              </td>
              <td className="px-4 py-3">{item.status == "checked_in" ? <div className="text-green-400">{item.status}</div> 
                                                                            : item.status == "pending" ? <div className="text-yellow-500">{item.status}</div>
                                                                            : <div className="text-red-400">{item.status}</div>}</td>
              <td className="px-4 py-3">{item.people_count ?? "N/A"}</td>
              <td className="px-4 py-3">{item.checkin_date ?? "N/A"}</td>
              <td className="px-4 py-3">{item.created_date ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {
        showCustomerDetail && createPortal(
          <ReservationCustomerDetail trigger={showCustomerDetail} setTrigger={setShowCustomerDetail} data={selectedData}></ReservationCustomerDetail>, document.body
        )
      }

      {
        showPopup && createPortal(
          <UpdateReservationStatus trigger={showPopup} setTrigger={setShowPopup} setAlert={setAlert} setAlertMessage={setAlertMessage} fetchData={fetchdata} data={selectedData}></UpdateReservationStatus>, document.body
        )
      }

      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

export function BillTable ( {data, fetchdata, setAlert, setAlertMessage} ) {

  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null); 
  
  const [page, setPage] = useState(0);
  
  const itemsPerPage = 12;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>  setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-stone-950 border border-gray-600">
        <thead className="text-xs uppercase bg-blue-500 text-white">
          <tr>
            <th scope="col" className="px-4 py-2">id</th>
            <th scope="col" className="px-4 py-2">order id</th>
            <th scope="col" className="px-4 py-2">reservation id</th>
            <th scope="col" className="px-4 py-2">table name</th>
            <th scope="col" className="px-4 py-2">customer role</th>
            <th scope="col" className="px-4 py-2">customer details</th>
            <th scope="col" className="px-4 py-2">total price</th>
            <th scope="col" className="px-4 py-2">status</th>
            <th scope="col" className="px-4 py-2">paid type</th>
            <th scope="col" className="px-4 py-2">paid date</th>
            <th scope="col" className="px-4 py-2">created at</th>
          </tr>
        </thead>
        <tbody className="bg-blue-50">
          {currentItems.map((item) => (
            <tr key={item.id} className="border-t border-gray-600">
              <td className="px-4 py-5">{item.id}</td>
              <td className="px-4 py-5">{item.order?.id ?? "N/A"}</td>
              <td className="px-4 py-5">{item.order?.reservation?.id ?? "N/A"}</td>
              <td className="px-4 py-5">{item.order?.table?.table_name ?? "N/A"}</td>
              <td className="px-4 py-5">{item.order?.reservation?.customer?.role ?? "N/A"}</td>
              <td className=" py-3">
                <button className="py-2 px-2 rounded-2xl transition-[box-shadow_background-color_color] bg-emerald-400 hover:bg-emerald-500"
                  onClick={() => { 
                    setSelectedData(item);
                    setShowCustomerDetail(true);
                   }}>
                  Details
                </button>
              </td>
              <td className="px-4 py-5">{item.total_price ?? "N/A"}</td>
              <td className="px-4 py-5">{item.status == "paid" ? <div className="text-green-400">{item.status}</div> 
                                                                            : item.status == "unpaid" ? <div className="text-yellow-500">{item.status}</div>
                                                                            : <div className="text-red-400">{item.status}</div>}</td>
              <td className="px-4 py-5">{item.type ?? "N/A"}</td>
              <td className="px-4 py-5">{item.paid_date ?? "N/A"}</td>
              <td className="px-4 py-5">{item.created_date ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {
        showCustomerDetail && createPortal(
          <BillCustomerDetail trigger={showCustomerDetail} setTrigger={setShowCustomerDetail} data={selectedData}></BillCustomerDetail>, document.body
        )
      }


      <div className="flex flex-row-reverse p-3 gap-10">
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300 "
          onClick={nextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
        <button className="px-4 py-2 rounded-xl transition-[box-shadow_background-color_color] bg-emerald-500 border-2 border-stone-800 
                        hover:bg-emerald-400 hover:border-stone-600 hover:text-stone-800 disabled:bg-stone-600 disabled:text-stone-300"
          onClick={prevPage} disabled={page <= 0}>
          Previous
        </button>
      </div>
    </div>
  );
};

