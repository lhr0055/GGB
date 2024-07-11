// orders에 상태와 비교하여 그에 따른 색상 표시하기

import { SD_Status } from "../Utility/SD";

const getStatusColor = (status: SD_Status) => {
    return status === SD_Status.CONFIRMED 
    ? "warning"
    : status === SD_Status.PAYMENT
    ? "warning"
    : status === SD_Status.CANCELLED
    ? "danger"
    : status === SD_Status.COMPLETED
    ? "primary"
    : status === SD_Status.PREPARING
    ? "warning"
    : status === SD_Status.SHIPPING && "warning";
} 

export default getStatusColor;