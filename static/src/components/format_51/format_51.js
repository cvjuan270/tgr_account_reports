/** @odoo-module **/

import { registry } from '@web/core/registry';
import { loadJS, loadCSS } from "@web/core/assets"
import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { TgrMultiselect } from "@tgr_account_reports/components/tgr_multiselect/tgr_multiselect";

export class Format51 extends Component {
    setup() {
        this.state = useState({
            startDate: false,
            endDate: false,
            loading: false,
            moveLines: [],
            companyIds: [],
            // account_journals
            journals: [],
            selectedJournalIds: [],
        });
        this.notificationService = useService('notification');
        this.rpc = useService('rpc');
        this.orm = useService('orm');

        onWillStart(async() => {
            console.log("onWillStart");
            console.log(await this.env.services)
            await this.getCompanyIds();
            this.state.journals = await this.orm.searchRead("account.journal", [], ["id", "name"]);
            // await this.fetchReport();
        });
    }
    async fetchReport() {
        const rslt = this.validateQueryparams();
        if (rslt.error) {
            this.notificationService.add(rslt.message,{type: "danger"});
            return;
        }
        await this.getCompanyIds();
        this.state.loading = true;
        const result = await this.rpc("/tgr_account_reports/format_51", {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            companyIds: this.state.companyIds,
            journalIds: this.state.selectedJournalIds,
        });
        this.state.loading = false;
        this.state.moveLines = result;
        console.log(result);
    }
    
    validateQueryparams() {
        if (!this.state.startDate || !this.state.endDate) {
            return {error: true, message: "Por favor, seleccione un rango de fechas"};
        }
        if (this.state.selectedJournalIds.length === 0) {
            return {error: true, message: "Por favor, seleccione al menos un diario contable"};
        }
        return true;
    }

    // ---------------------- Computed ----------------------

    // ---------------------- Event Handlers ----------------------

    handleSelectionChangeJournals(selectedJournals) {
        console.log(selectedJournals);
        this.state.selectedJournalIds = selectedJournals.filter(journal => journal.selected).map(journal => journal.id);
    }

    async printPdf(){
        const url = "/tgr_account_reports/print_pdf?startDate=" + this.state.startDate + "&endDate=" + this.state.endDate + "&companyIds=" + this.state.companyIds + "&journalIds=" + this.state.selectedJournalIds;
        window.open(url, '_blank')
        // const result = await this.rpc("/tgr_account_reports/print_pdf", {
        //     startDate: this.state.startDate,
        //     endDate: this.state.endDate,
        //     companyIds: this.state.companyIds,
        //     journalIds: this.state.selectedJournalIds,
        // });
        // console.log(result);

    }

    // ---------------------- Helpers ----------------------
    async getCompanyIds() {
        this.state.companyIds = await Object.keys(this.env.services.company.availableCompanies).map(key=>parseInt(key));
    }
    getFormatDate(date) {
        date = new Date(date);
        let day = date.getDate();
        let month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
        let year = date.getFullYear();
    
        // Asegurarse de que el día y el mes tengan dos dígitos
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
    
        return `${day}/${month}/${year}`;
    }

    getFormatMonetay(value) {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
        }).format(value);
    }

    getFormatNumber(value) {
        return new Intl.NumberFormat("es-PE").format(value);
    }


}

Format51.template = "tgr_account_reports.Format51";
Format51.components = { TgrMultiselect };

registry.category("actions").add('tgr_account_reports.action_format_51', Format51);