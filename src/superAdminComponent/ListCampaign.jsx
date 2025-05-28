import axiosInstance from "../utils/axiosInstance";

export default function ListCampaign() {
  const [campaign, setCampaign] = useState([]);

  const getAllCampaigns = async () => {
    try {
      const res = await axiosInstance.get(`/campaign/all`);
      setCampaign(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCampaigns();
  }, []);

  return <div></div>;
}
