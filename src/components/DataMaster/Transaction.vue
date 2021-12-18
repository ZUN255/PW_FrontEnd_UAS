<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> Transaksi </h3>

        <v-card class="grey lighten-3">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>

                <v-spacer></v-spacer>

                <v-btn color="green darken-4" dark @click="dialog = true">Buy</v-btn>

            </v-card-title>
            <v-data-table :headers="headers" :items="transactions" :search="search">
                <template v-slot:[`item.actions`] = "{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)"> <v-icon color="green darken-4">mdi-pencil</v-icon> </v-btn>
                    <v-btn small class="mr-2" @click="deleteHandler(item.id)"> <v-icon color="red accent-4">mdi-delete</v-icon> </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="700px" >
            <v-card class="grey lighten-3">
                <v-card-title>
                    <span class="headline">{{ formTitle }} Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_barang" label="Nama Barang" required></v-text-field>
                        <v-text-field v-model="form.harga_barang" label="Harga Barang" required></v-text-field>
                        <v-text-field v-model="form.jumlah_barang" label="Jumlah Barang" required></v-text-field>
                        <v-text-field v-model="form.subtotal" label="Subtotal" required></v-text-field>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="green darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="327px">
            <div class="text-center">
                <v-sheet class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block" color="blue-grey darken-3" dark >
                    <div class="grey--text text--lighten-1 text-body-2 mb-4">
                        Yakin ingin hapus Transaksi ini?
                    </div>

                    <v-btn plain color="blue darken-1" @click="dialogConfirm = false">No</v-btn>
                    <v-btn plain color="blue darken-1" @click="deleteData">Yes</v-btn>
                </v-sheet> 
            </div>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>

    </v-main>
</template>

<script>
    export default {
        name: "List",
        data(){
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                idUser: 0,
                dialog: false,
                dialogConfirm: false,
                dialogAddToCart: false,
                tempCart: {
                    id_barang: null,
                    id_user: null,
                    namaBarang_transaksi: null,
                    hargaBarang_transaksi: null
                },
                headers: [
                    {
                        text: "Nama Barang",
                        align: "start",
                        sortable: true,
                        value: "nama_barang",
                    },
                    { text: "Harga Barang", value: 'harga_barang' },
                    { text: "Jumlah Barang", value: 'jumlah_barang' },
                    { text: "Subtotal", value: 'subtotal' },
                    { text: "Actions", value: 'actions' },
                ],
                transaction: new FormData,
                transactions: [],
                form: { 
                    nama_minuman: null,
                    harga_minuman: null,
                    jumlah_barang: null,
                    subtotal : null,
                },
                deleteId: '',
                editId: ''
            };
        },
        methods: {
            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
            },
            // Read Data Transaksi
            readData() {
                var url = this.$api + '/transaction';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.transactions = response.data.data;
                })
            },

            save(){
                this.transaction.append('nama_barang', this.form.nama_barang);
                this.transaction.append('harga_barang', this.form.harga_barang);
                this.transaction.append('jumlah_barang', this.form.jumlah_barang);
                this.transaction.append('subtotal', this.form.subtotal);

                var url = this.$api + '/transaction/'
                this.load = true;
                this.$http.post(url, this.transaction, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            update() {
                let newData = {
                    nama_barang : this.form.nama_barang,
                    harga_barang : this.form.harga_barang,
                    jumlah_barang : this.form.jumlah_barang,
                    subtotal : this.form.subtotal
                };
                var url = this.$api + '/transaction/' + this.editId;
                this.load = true;
                this.$http.put(url, newData, {
                    headers: {
                        'Authorization' : 'Bearer ' +localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/transaction/' + this.deleteId;
                this.load = true;
                this.$http.delete(url, {
                    headers: {
                        'Authorization' : 'Bearer ' +localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = "Tambah";
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            editHandler(item) {
                this.inputType = 'Edit';
                this.editId = item.id;
                this.form.nama_barang = item.nama_barang;
                this.form.harga_barang = item.harga_barang;
                this.form.jumlah_barang = item.jumlah_barang;
                this.form.subtotal = item.subtotal;
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.dialogAddToCart = false;
                this.readData();
            },

            cancel() {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    nama_minuman: null,
                    harga_minuman: null
                };
            },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
            this.idUser = localStorage.getItem('id');
        },
    };
</script>