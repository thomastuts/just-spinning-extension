import axios from "axios";

const instance = axios.create({
  baseURL: process.env.EBS_ENDPOINT,
});

export const setAuthToken = token => {
  instance.interceptors.request.use(config => {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    return config;
  });
};

export function getChannelConfig() {
  return instance.get(`/config`);
}

export function getQueue() {
  return instance.get(`/queue`);
}

export function getActivePrize() {
  return instance.get(`/active-prize`);
}

export function startPrize(prizeId) {
  return instance.post(`/prizes/${prizeId}/start`);
}

export function fulfillPrize(prizeId) {
  return instance.post(`/prizes/${prizeId}/fulfill`);
}

export function refundPrize(prizeId) {
  return instance.post(`/prizes/${prizeId}/refund`);
}

export function getFakeAuthToken({ channelId, userId }) {
  return instance.get(`/debug/fake-auth-token?channel_id=${channelId}&user_id=${userId}`);
}
