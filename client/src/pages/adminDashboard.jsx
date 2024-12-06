import CustomButtonGroup from "../components/ButtonGroup"

const AdminDashboard = () =>
{
    const buttonGroups = [
  ["اضافة حساب"],
  ["عرض المشتركين","عرض الاشبال","عرض اولياء الامور","عرض القادة"],
  ["عرض التعاملات"],
  ["عرض الطلبات"],
  ["اضافة انجاز"],
  ["اضافة موقع"]
];
    return (
        <CustomButtonGroup groups={buttonGroups}/>
    )
}
export default AdminDashboard