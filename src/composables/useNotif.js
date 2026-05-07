import { reactive } from "vue";

export const notif = reactive({
  tampil: false,
  pesan: "",
});

export const tampilNotif = (pesan) => {
  notif.pesan = pesan;
  notif.tampil = true;
  setTimeout(() => {
    notif.tampil = false;
  }, 2500);
};
