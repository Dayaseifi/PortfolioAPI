import moment from 'jalali-moment';

export interface FunctionReturnType {
    success: boolean;
    Problem?: "Now" | "Feature";
}

export function timeController(startYear: number, endYear: number, startMonth: number, endMonth: number): FunctionReturnType {
    const currentDate = moment().locale('fa');

    const currentYear: number = currentDate.jYear();
    const currentMonth: number = currentDate.jMonth() + 1; 
    const yearFalseCondition: boolean = startYear > endYear;
    const monthFalseCondition: boolean = (startYear === endYear && startMonth > endMonth);
    
    if (yearFalseCondition || monthFalseCondition) {
        return {
            success: false,
            Problem: "Now"
        };
    }
    if (startYear > currentYear || (startYear === currentYear && startMonth > currentMonth)) {
        return {
            success: false,
            Problem: "Feature"
        };
    }

    return {
        success: true
    };
}

