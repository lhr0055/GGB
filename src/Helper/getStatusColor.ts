// orders에 상태와 비교하여 그에 따른 색상 표시하기

import { SD_Status } from "../Utility/SD";

const getStatusColor = (status: SD_Status) => {
    return status === SD_Status.CONFIRMED 
    ? 'secondary' 
    : status === SD_Status.PAYMENT
    ? "secondary"
    : status === SD_Status.CANCELLED
    ? "danger"
    : status === SD_Status.COMPLETED
    ? "primary"
    : status === SD_Status.PREPARING
    ? "secondary"
    : status === SD_Status.SHIPPING && "secondary";
} 

export default getStatusColor;