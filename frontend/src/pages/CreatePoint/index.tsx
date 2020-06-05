import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';


import api from '../../services/api'

import './styles.css'
import logo from '../../assets/logo.svg'

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGE_UF_Response {
    sigla: string
}

interface IBGE_City_Response {
    nome: string
}

const CreatePoint = () => {

    // "Atributo" items
    const [items, set_items] = useState<Item[]>([]);

    // Unidades Federativas
    const [ufs, set_ufs] = useState<string[]>([]);

    // Handler do select de UFs
    const [selected_uf, set_selected_uf] = useState<string>('0');

    // Cidades
    const [cities, set_cities] = useState<string[]>([]);

    // Handler do select de cidades
    const [selected_city, set_selected_city] = useState<string>('0');

    // Posição do marker no mapa
    const [selected_position, set_selected_position] = useState<[number, number]>([-20.2736352, -40.3059216]);

    // Posição inicial do mapa
    const [initial_position, set_initial_position] = useState<[number, number]>([-20.2736352, -40.3059216]);

    // Estado do form
    const [form_data, set_form_data] = useState( {
        name: '',
        email: '',
        whatsapp: ''
    });

    // Itens selecionados pelo usuário
    const [selected_items, set_selected_items] = useState<number[]>([]);

    const history = useHistory();

    // Apenas na criação do componente - Chamada pra API interna do projeto
    useEffect(() => {
        api.get('items').then(res => {
            set_items(res.data);
        })
    }, []);

    // Posição inicial do mapa
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            const {latitude, longitude} = pos.coords;
            set_initial_position([latitude, longitude]);
        });
    }, []);

    // Chamada pra API do IBGE - UF
    useEffect(() => {
        axios.get<IBGE_UF_Response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            const uf_initials = res.data.map(uf => uf.sigla);
            set_ufs(uf_initials);
        })
    }, [])

    // Chamada pra API do IBGE - Cidade
    useEffect(() => {
        if(selected_uf === '0')
            return;
        axios.get<IBGE_City_Response[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selected_uf}/municipios`)
        .then(res => {
            const cities_names = res.data.map(city => city.nome);
            set_cities(cities_names)
        })
    }, [selected_uf]);

    function handle_select_uf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        set_selected_uf(uf);
    }

    function handle_select_city(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        set_selected_city(city);
    }

    function handle_map_click(event: LeafletMouseEvent) {
        set_selected_position([event.latlng.lat, event.latlng.lng]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        set_form_data({...form_data, [name]: value });
    }

    function handle_select_item(id: number) {
        // Haskell?? Hehe
        const already_selected = selected_items.findIndex(item => item === id);
        if(already_selected >= 0) {
            const filtered_items = selected_items.filter(item => item !== id);
            set_selected_items(filtered_items);
        }
        else {
            set_selected_items([...selected_items, id]);
        }
    }

    async function handle_submit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = form_data;
        const uf = selected_uf;
        const city = selected_city;
        const [lat, lng] = selected_position;
        const items = selected_items;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude: lat,
            longitude: lng,
            items
        }
        await api.post('points', data);
        alert('Ponto de coleta criado!');
        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para a Home
                </Link>
            </header>
            <form >
                <h1>Cadastro do <br />ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                         type="text"
                         name="name"
                         id="name"
                         onChange={handleInputChange}
                         />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initial_position} zoom={18} onClick={handle_map_click}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={selected_position} />
                    </Map>
                    <div className="field-group">
                    <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                            name="uf"
                            id="uf"
                            onChange={handle_select_uf}
                            value={selected_uf}>
                                <option value="0">Selecione uma UF</option>

                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}

                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                            name="city"
                             id="city"
                             onChange={handle_select_city}
                             value={selected_city} >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                            key={item.id}
                            onClick={() => handle_select_item(item.id)}
                            className={selected_items.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span></li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit" onClick={handle_submit}>
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;