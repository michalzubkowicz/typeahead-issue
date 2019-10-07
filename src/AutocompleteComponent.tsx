import React, {Component} from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';

export interface AutocompleteElement {
    id: number,
    label: string;
}

export const MAX_ARTICLE_RESULTS = 3;


interface SearchAutocompleteComponentState {
    isLoading: boolean;
    items: AutocompleteElement[];
    lastPage: number;
    lastSearch: string;
}

export class AutocompleteComponent extends Component<{}, SearchAutocompleteComponentState> {

    constructor(props: {}, state: SearchAutocompleteComponentState) {
        super(props, state);

        this.state = {
            isLoading: false,
            items: [],
            lastPage: 1,
            lastSearch: '',
        };

    }

    private getDataToAutocompleteField = (val: string, nextPage?: boolean) => {
        let lastPage = this.state.lastPage;

        if (nextPage) {
            this.setState({
                isLoading: true,
            });
            console.log('New last page' , this.state.lastPage);
            lastPage ++;
        } else {
            this.setState({
                lastPage: 1,
                items: [],
                lastSearch: val,
                isLoading: true,
            })

        }

        new Promise<AutocompleteElement[]>((resolve, reject) => {
            resolve([
                {id: 1, label: '11111' +lastPage},
                {id: 2, label:  '11112' + lastPage},
                {id: 3, label: '11113' + lastPage},
                {id: 4, label: '11114' + lastPage},
            ])
        })
        .then((res: AutocompleteElement[]) => {
            console.log('New items', res);
            this.setState({
                items: this.state.items.concat(...res),
                lastPage,
                isLoading: false,
            });
        }).catch((err: any) => {
            this.setState({
                isLoading: false,
            });
            console.error('Error when getting autocomplete results', err);
        });
    };

    private getNextDataToAutcompletePage() {
        console.log('getting next page');
        this.getDataToAutocompleteField(this.state.lastSearch, true);
    }

    render() {
        return <AsyncTypeahead
            id="autocompletearticle"
            allowNew={false}
            isLoading={this.state.isLoading}
            multiple={false}
            maxResults={MAX_ARTICLE_RESULTS - 1}
            options={this.state.items}
            labelKey="label"
            minLength={3}
            selectHintOnEnter={true}
            onSearch={(v: any) => {
                this.getDataToAutocompleteField(v)
            }}
            onPaginate={() => {
                this.getNextDataToAutcompletePage();
            }}
            paginate={true}
        />
    }


}
