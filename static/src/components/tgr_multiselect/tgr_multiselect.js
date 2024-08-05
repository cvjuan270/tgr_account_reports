/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class TgrMultiselect extends Component{
    static template = "tgr_account_reports.TgrMultiselect";
    setup(){
        this.state = useState({
            label: this.props.placeholder,
            options: this.props.options.map(o=>({...o, selected: false})),
            selectAll: false,
        })
    }

    toggleSelectAll() {
        const newSelectAllState = !this.state.selectAll;
        this.state.selectAll = newSelectAllState;
        this.state.options.forEach(option => option.selected = newSelectAllState);
        this.props.onSelectionChange(this.state.options);

        this.state.label = 'Seleccionados ' + this.state.options.filter(o => o.selected).length + ' de ' + this.state.options.length;
    }

    toggleOption(optionId) {
        const option = this.state.options.find(opt => opt.id == optionId);
        option.selected = !option.selected;
        this.state.selectAll = this.state.options.every(opt => opt.selected);
        this.props.onSelectionChange(this.state.options);

        this.state.label = 'Seleccionados ' + this.state.options.filter(o => o.selected).length + ' de ' + this.state.options.length;
    }

    static props = {
        options: Array,
        placeholder: String,
        onSelectionChange: Function,
    }
}
