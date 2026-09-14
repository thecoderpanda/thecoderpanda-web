---
title: "Building an ERC20 Tracker with Hemera in Under 30 Minutes"
subtitle: "Tracking ERC20 token transfers across blockchain networks can be complex due to the volume of data and the intricacies of parsing smart contract logs. Hemera Protocol simplifies th"
date: 2025-01-16T13:22:44.000Z
slug: hemera-building-an-erc20-tracker-with-hemera-in-under-30-minutes
---

Tracking ERC20 token transfers across blockchain networks can be complex due to the volume of data and the intricacies of parsing smart contract logs. Hemera Protocol simplifies this process by leveraging its Account-Centric Indexing (ACI) and User-Defined Functions (UDFs). In this guide, you’ll learn how to build an ERC20 tracker using Hemera’s UDF capabilities in under 30 minutes.

![](https://cdn-images-1.medium.com/max/1024/1*beJMZ5u3rAusWAerP13p4w.png)

### Prerequisites

Before getting started, ensure you have the following:

- **Hemera Indexer:** Set up the Hemera Indexer by following the installation instructions in the Hemera documentation.
- **Development Environment:**  
  - **Python Environment:** Ensure Python is installed on your system.  
  - **IDE/Text Editor**: Use Visual Studio Code or any other code editor.  
  - **Postgresql DB:** Hemera uses postgres as a data output.
- **Basic Knowledge of Python and Solidity:** Familiarity with Ethereum and ERC20 contracts is recommended.

### Step 1: Setting Up the Hemera Indexer

**Clone the Hemera Indexer Repository:**

```
git clone https://github.com/HemeraProtocol/hemera-indexer.git  
cd hemera-indexer
```

**Install Dependencies:** Follow the [prerequisites](https://docs.thehemera.com/hemera-indexer/installation#prerequisites) and [installation](https://docs.thehemera.com/hemera-indexer/installation#install--run) sections in the Hemera documentation to install the necessary dependencies and set up the indexer. If you are using a unix / linux machine, you can follow the “build from source” guide as it gives full control over your UDFs and debugging.

```
make development  
source venv/bin/activate
```

This will activate a local development environment for you to play with. Next up, we’ll set the UDF configuration!

### Step 2: Writing User Defined Functions

User-Defined Functions (UDFs) enable developers to define custom data extraction and transformation logic tailored to specific blockchain data needs. By leveraging UDFs, developers can efficiently parse and interpret smart contract events such as ERC20 token transfers.

There are three major components in UDFs:

**Data Classes:** Data classes are used to structure the data input and output for the UDF. These classes help define the schema for logs and the parsed results, ensuring the data is easy to process and query.

**Create Data Classes:** Create the data classes in the indexer/modules/custom/{project\_name}/domains directory. This ensures your data structures are correctly organized within the indexer.

*Find the detailed code here:* [*https://github.com/HemeraProtocol/hemera-indexer/blob/erc20token/indexer/modules/custom/erc20\_token/domain/erc20\_token\_mint.py*](https://github.com/HemeraProtocol/hemera-indexer/blob/erc20token/indexer/modules/custom/erc20_token/domain/erc20_token_mint.py)

```
#!/usr/bin/env python3  
# -*- coding: utf-8 -*-  
  
from dataclasses import dataclass  
  
from indexer.domain import FilterData  
  
  
@dataclass  
class ERC721TokenMint(FilterData):  
    address: str  
    token_address: str  
    token_id: int  
    block_number: int  
    block_timestamp: int  
    transaction_hash: str  
    log_index: int
```

**Data Models:** Data models represent how the data flows through the UDF. They map the raw blockchain log data to structured outputs that can be queried and visualized.

**Create Data Models:** Add the mapping logic in the indexer/modules/custom/{project\_name}/models directory. Data models define how raw logs are mapped to structured outputs.

*Find the detailed code here:* <https://github.com/HemeraProtocol/hemera-indexer/blob/erc20token/indexer/modules/custom/erc20_token/models/erc20_token_mint.py>

```
#!/usr/bin/env python3  
# -*- coding: utf-8 -*-  
  
from sqlalchemy import Column, Index, PrimaryKeyConstraint, func, text  
from sqlalchemy.dialects.postgresql import BIGINT, BOOLEAN, BYTEA, INTEGER, NUMERIC, TIMESTAMP  
  
from common.models import HemeraModel, general_converter  
  
  
class ERC721TokenMint(HemeraModel):  
    __tablename__ = "erc721_token_mint"  
  
    address = Column(BYTEA)  
    token_address = Column(BYTEA, primary_key=True)  
    token_id = Column(NUMERIC(100), primary_key=True)  
  
    block_number = Column(BIGINT)  
    block_timestamp = Column(TIMESTAMP)  
    transaction_hash = Column(BYTEA)  
    log_index = Column(INTEGER)  
  
    create_time = Column(TIMESTAMP, server_default=func.now())  
    update_time = Column(TIMESTAMP, server_default=func.now())  
    reorg = Column(BOOLEAN, server_default=text("false"))  
  
    __table_args__ = (PrimaryKeyConstraint("token_address", "token_id"),)  
  
    @staticmethod  
    def model_domain_mapping():  
        return [  
            {  
                "domain": "ERC721TokenMint",  
                "conflict_do_update": True,  
                "update_strategy": None,  
                "converter": general_converter,  
            },  
        ]  
  
  
Index(  
    "erc721_token_mint_address_id_index",  
    ERC721TokenMint.token_address,  
    ERC721TokenMint.token_id,  
)
```

**Job Logic:** The job logic defines how the UDF processes incoming data and applies the necessary transformations. It includes the core functionality of the UDF, such as filtering relevant logs and transforming them into structured data.

**Create Job Logic:** Implement the job logic in the indexer/modules/custom/{project\_name}/job.py file. This is where the UDF processes the data and applies the transformations.

*Find the detailed code here:* <https://github.com/HemeraProtocol/hemera-indexer/blob/erc20token/indexer/modules/custom/erc20_token/erc20token.py>

```
from typing import List  
from indexer.domain.log import Log  
from indexer.domain.token_transfer import TokenTransfer  
from indexer.jobs.base_job import Collector, FilterTransactionDataJob  
from indexer.utils.abi_setting import ERC20_TRANSFER_EVENT  
from common.utils.web3_utils import ZERO_ADDRESS  
  
def _filter_erc20_transfer_event(logs: List[Log]) -> List[TokenTransfer]:  
    token_transfers = []  
    for log in logs:  
        if log.topic0 == ERC20_TRANSFER_EVENT.get_signature():  
            decoded_data = ERC20_TRANSFER_EVENT.decode_log(log)  
            if decoded_data["from"] != ZERO_ADDRESS:  
                token_transfers.append(  
                    ERC20TokenTransfer(  
                        address=decoded_data["to"],  
                        token_address=log.address,  
                        value=decoded_data["value"],  
                        block_timestamp=log.block_timestamp,  
                        block_number=log.block_number,  
                        transaction_hash=log.transaction_hash,  
                        log_index=log.log_index,  
                    )  
                )  
    return token_transfers
```

Refer to this branch for more details:<https://github.com/HemeraProtocol/hemera-indexer/tree/erc20token>

### Step 3: Running the System: Detecting Jobs and Executing UDFs

Once the components for processing ERC20 token transfers are in place, the system automatically detects registered jobs. Each job specifies an output\_type, which defines the data type the job processes and outputs. This output type links the logic to the execution system, enabling the running of UDFs (user-defined functions).

To execute the UDF, use the following command:

```
python hemera.py stream \  
    --provider-uri https://ethereum.publicnode.com \  
    --postgres-url postgresql://devuser:devpassword@localhost:5432/hemera_indexer \  
    --output jsonfile://output/eth_blocks_20000001_20010000/json,csvfile://output/hemera_indexer/csv,postgresql://devuser:devpassword@localhost:5432/eth_blocks_20000001_20010000 \  
    --start-block 20000001 \  
    --end-block 20010000 \  
    --entity-types EXPLORER_BASE \  
    --block-batch-size 200 \  
    --batch-size 200 \  
    --max-workers 32
```

### Command Breakdown:

1. **--provider-uri**: Specifies the Ethereum node provider to fetch blockchain data.
2. **--postgres-url**: Connection string for the PostgreSQL database where the data will be stored.
3. **--output**: Defines output formats (JSON, CSV, and PostgreSQL in this case) and their destinations.
4. **--start-block** and **--end-block**: The range of blocks to process.
5. **--entity-types**: Specifies the types of entities to process (EXPLORER\_BASE in this case).
6. **--block-batch-size** and **--batch-size**: Control the processing batch size for blocks and transactions.
7. **--max-workers**: Sets the number of worker threads to parallelize the job.

### Testing Output with PostgreSQL

To verify the output, connect to the PostgreSQL database and inspect the results:

```
psql -h localhost -U {your_username} -d hemera_indexer
```

Sample queries:

**Check the table structure**:

```
\d erc20_token_transfer;
```

**View the first 10 rows**:

```
SELECT * FROM erc20_token_transfer LIMIT 10;
```

**Count the total number of transfers**:

```
SELECT COUNT(*) FROM erc20_token_transfer;
```

### GUI-Based Database Inspection

For a more visual approach, use tools like:

- **pgAdmin**: A comprehensive PostgreSQL management tool.
- **DBeaver**: A multi-platform database GUI client.
- **TablePlus**: A lightweight and modern database management app.

### Integrating a Frontend with the Application

To integrate a frontend, follow these steps:

**Expose APIs**:

- Use a backend framework like **FastAPI** or **Express.js** to build APIs that query the database.
- Example endpoints:
- /transfers: Fetch paginated token transfers.
- /transfer/:hash: Get transfer details by transaction hash.

**Database Design Considerations**:

- Optimize database queries for frontend requirements.
- Create indexes on frequently queried fields like transaction\_hash and block\_number.

**Frontend Framework**:

- Use **React.js** or **Next.js** to create dashboards displaying transfer data.
- Example components:
- A table for token transfers.
- A chart for transfer trends over time.

### Ideas for Extensions

1. **Custom Alerts**: Notify users when large transfers occur.
2. **Token Analytics**: Visualize token transfer trends and volume.
3. **Real-Time Updates**: Add live tracking for token transfers using WebSocket APIs.

### Join the Builder Program

Have ideas or want to contribute? Join our **Builder Program** to get early access to features, exclusive resources, and community support.

👉 **Join our Telegram Community**: [Hemera Builders](https://t.me/+lRAwDZJc65UyZDY1)

Your creativity can redefine how data interacts with blockchain. Build with us!

## The pipeline in one picture

```mermaid
flowchart LR
    Chain[Chain events] --> Sub[Hemera subscription]
    Sub --> Store[(Local store)]
    Store --> API[Your API]
    API --> UI[Tracker UI]
```
