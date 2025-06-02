import { MainCard } from "../../components/style/styleComponent";
import axiosInstance from "../../utils/axiosInstance";

export default function ListAllCampaign() {
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

  return (
    <MainCard>
      <h1>All Campaigns</h1>
    </MainCard>
  );
}
