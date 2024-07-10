// Menu 이미지 파일 올리기
import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import { useCrateMenuItemMutation, useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from "../../Apis/menuItemApi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Categories } from "../../Utility/SD";


const Categories = [
  SD_Categories.CABBAGE_KIMCHI,
  SD_Categories.RADISH_KIMCHI,
  // SD_Categories.GREEN_ONION_KIMCHI,
  // SD_Categories.CUCUMBER_KIMCHI,
  SD_Categories.OTHER_KIMCHI,
  SD_Categories.DISH,
];

const menuItemData = {
    name: "",
    description: "",
    specialTag:"",
    category: Categories[0],
    price: "",
};

function MenuItemUpsert(){
    const { id } = useParams();

    const navigate = useNavigate();
    const [imageToStore, setImageToStore] = useState<any>();
    const [imageToDisplay, setImageToDisplay] = useState<string>("");
    const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
    const [loading, setLoading] = useState(false);
    const [createMenuItem] = useCrateMenuItemMutation();
    const [updateMenuItem] = useUpdateMenuItemMutation();
    const { data } = useGetMenuItemByIdQuery(id);


    useEffect(() => {
        // 로컬 스토리지에서 데이터 불러오기
        const savedData = localStorage.getItem("menuItemData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setMenuItemInputs(parsedData.inputs);
        }
    }, []);



    useEffect(()=>{
      if(data && data.result){
        const tempData = {
          name: data.result.name,
          description: data.result.description,
          specialTag:data.result.specialTag,
          category: data.result.category,
          price: data.result.price,
        };
        setMenuItemInputs(tempData);
        setImageToDisplay(data.result.image);
      }
    }, [data]);



    useEffect(() => {
        // 로컬 스토리지에 데이터 저장하기
        const dataToSave = {
            inputs: menuItemInputs,
        };
        localStorage.setItem("menuItemData", JSON.stringify(dataToSave));
    }, [menuItemInputs]);





    const handleMenuItemInput = (
        e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const tempData = inputHelper(e, menuItemInputs) //임시데이터에 입력값헬퍼로 전달한다.
        setMenuItemInputs(tempData);//임시데이터로 입력값을 전달한다.(입력받을 수 있게함))
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        const file = e.target.files && e.target.files[0];
        if(file){
            const imgType = file.type.split('/') [1];
            const validImgTypes = ["jpg", "jpeg", "png"];

            const isImageTypeValid = validImgTypes.filter((e)=>{
                return e === imgType;
            });
            if(file.size > 1000 * 1024) {
                setImageToStore("");
                //toastNotify("File Must be less then 1 MB", "error");
                return;
            }
            else if (isImageTypeValid.length === 0){
                setImageToStore("");
                //toastNotify("File Must be in jpeg, jpg or png", "error");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            setImageToStore(file);
            reader.onload = (e) => {
                const imgUrl = e.target?.result as string;
                setImageToDisplay(imgUrl);
            };
        }
      };

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if(!imageToStore && !id){
          //toastNotify("Please upload an image","error");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("Name", menuItemInputs.name);
        formData.append("Description", menuItemInputs.description);
        formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
        formData.append("Category", menuItemInputs.category);
        formData.append("Price", menuItemInputs.price);
        formData.append("File", imageToStore);
        if(imageToDisplay) formData.append("File", imageToStore);

        let response;

        if(id){
          //update
          formData.append("Id", id);
          response = await updateMenuItem({data: formData,id})
          toastNotify("메뉴가 수정되었습니다.", "success");
        }
        else{
          //create
          response = await createMenuItem(formData);
          toastNotify("메뉴가 추가되었습니다", "success");
        }

        if(response){
            localStorage.removeItem("menuItemData"); // 제출 후 로컬 스토리지 초기화
          setLoading(false);
          navigate("/menuItem/menuitemlist");
        }
        setLoading(false);
      };

    return(
        <div className="container border mt-5 p-5 bg-light">
          {loading && <MainLoader/>}
          {/* id를 기반으로 편집 메뉴 항목 표시하고 id 없을 경우 추가 표시 */}
          <h3 className="px-2 text-dark BookkMyungjo-Bd">
            {id ? "메뉴 수정하기" : "메뉴 추가하기"}
          </h3>
        <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="제품명..."
                required
                name="name"
                value={menuItemInputs.name}
                onChange={handleMenuItemInput}
              />
              <textarea
                className="form-control mt-3"
                placeholder="설명..."
                name="description"
                rows={10}
                value={menuItemInputs.description}
                onChange={handleMenuItemInput}
              ></textarea>
              <input
                type="text"
                className="form-control mt-3"
                placeholder="Tag..."
                name="specialTag"
                value={menuItemInputs.specialTag}
                onChange={handleMenuItemInput}
              />
              <select
                className="form-control mt-3 form-select"
                // placeholder="Enter Category"
                name="category"
                value={menuItemInputs.category}
                onChange={handleMenuItemInput}
              >
                {Categories.map((Category)=> (
                  <option value={Category}>{Category}</option>
                ))}

              </select>
              <input
                type="number"
                className="form-control mt-3"
                required
                placeholder="Enter Price"
                name="price"
                value={menuItemInputs.price}
                onChange={handleMenuItemInput}
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="form-control mt-3"
              />
              <div className="row">
                <div className="col-6">
                  <button
                      type="submit"
                      className="btn btn-danger form-control mt-3">
                      {/* id가 있으면 업뎃, 없으면 생성으로 버튼 이름 표시하기 */}
                      {id ? "업데이트" : "추가하기" }
                  </button>
                </div>
                <div className="col-6">
                    <a
                      onClick={() => navigate("/menuItem/menuitemlist")}
                      className="btn btn-secondary form-control mt-3">
                      메뉴리스트
                    </a>
                </div>
              </div>
            </div>
            <div className="col-md-5 text-center">
              <img
                src={imageToDisplay}
                style={{ width: "100%", borderRadius: "30px" }}
                alt=""
              />
            </div>
            </div>
        </form>
      </div>
    )
}
export default MenuItemUpsert;