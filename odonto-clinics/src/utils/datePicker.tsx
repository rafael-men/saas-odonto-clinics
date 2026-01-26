'use client';

import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";

registerLocale('pt-BR', ptBR);

export function DateTimePicker() {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
            locale="pt-BR"
            showTimeSelect
            dateFormat="Pp"
        />
    );
}